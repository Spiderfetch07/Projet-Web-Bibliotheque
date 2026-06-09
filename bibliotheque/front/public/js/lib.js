(function () {

  var AppConfig = {
    paths: {
      js: '/public/js',
      css: '/public/css',
      html: '/public/html'
    },
    useLocalStorage: false,
    localStorageId: (new Date()).getTime(),
    storedFileTypes: {
      "script": true,
      "css": true,
      "html": true,
      "json": false,
      "text": false,
    }
  };

  //All files loaded
  var AppCache = {};

  function addCache(url) {
    AppCache[url] = {
      file: "",
      event: null,
      state: "loading",
      listeners: [],
      type: "",
      stack: false,
      isEval: false
    };
  }

  function getAllResult(orders) {
    return orders.map(url => {
      const cleanUrl = CleanPath(url);
      if (AppCache[cleanUrl] && AppCache[cleanUrl].stack && AppCache[cleanUrl].stack.result) {
        return AppCache[cleanUrl].stack.result;
      } else if (AppCache[cleanUrl] && AppCache[cleanUrl].stack === false) {
        return AppCache[cleanUrl].file;
      }
      return false;
    });
  }

  //local storage
  function LocalStorageUpToDate() {
    return localStorage.getItem("localStorageId") + "" === AppConfig.localStorageId + "";
  };

  function addCacheFromLocalStorage(url) {
    if (!AppConfig.useLocalStorage) {
      return false;
    }
    if (!LocalStorageUpToDate()) {
      localStorage.clear();
      localStorage.setItem("localStorageId", AppConfig.localStorageId);
      return false;
    }
    var s = localStorage.getItem(url);
    if (s) {
      var ob = JSON.parse(s);
      addCache(url);
      AppConfig[url].file = ob.file;
      AppConfig[url].type = ob.type;
      AppConfig[url].state = "loaded";
      if (ob.type === "script") {
        AppConfig[url].isEval = true;
        AppConfig[url].stack = eval.apply(window, [AppConfig[url].file]);
      }
      return true;
    }
    return false;
  }

  function CleanPath(url) {
    for (var pathName in AppConfig.paths) {
      url = url.replace('[' + pathName + ']', AppConfig.paths[pathName]);
    }
    url = url.replace('//', '/');
    return url;
  };

  function addToLocalStorage(url, type, file) {
    if (!AppConfig.useLocalStorage || !AppConfig.storedFileTypes[type]) {
      return false;
    }
    var ob = {
      type: type,
      file: file
    };
    var s = JSON.stringify(ob);
    try {
      localStorage.setItem(url, s);
      return true;
    }
    catch (e) {
      return false;
    }
  }

  function onXHRSuccess(evt) {
    var xhr = evt.currentTarget;
    if (xhr.status !== 200) {
      onXHRError(evt);
      return;
    }
    var url = xhr.url;
    var cache = AppCache[url];
    cache.file = xhr.responseText;
    cache.event = evt;
    cache.state = "loaded";
    addToLocalStorage(url, cache.type, cache.file);
    if (cache.type === "script") {
      cache.isEval = true;
      cache.stack = eval.apply(window, [cache.file]);
    }
    //success callbacks
    for (var i = 0; i < cache.listeners.length; i++) {
      if (cache.listeners[i].success) {
        cache.listeners[i].success(xhr.responseText, cache.listeners[i]);
      }
    }
  }

  function onXHRError(evt) {
    var url = evt.currentTarget.url;
    var cache = AppCache[url];
    cache.event = evt;
    cache.state = "error";

    //error callbacks
    for (var i = 0; i < cache.listeners.length; i++) {
      if (cache.listeners[i].error) {
        cache.listeners[i].error(evt, cache.listeners[i]);
      }
    }
  }

  function onXHRProgress(evt) {
    var xhr = evt.currentTarget;
    if (xhr.status !== 200) {
      return;
    }
    var loaded = 0;
    var total = 0;
    if (evt.lengthComputable) {
      loaded = evt.loaded;
      total = evt.total;
    }
    var url = evt.currentTarget.url;
    var cache = AppCache[url];

    //progress callbacks
    for (var i = 0; i < cache.listeners.length; i++) {
      if (cache.listeners[i].progress) {
        cache.listeners[i].progress(loaded, total, cache.listeners[i]);
      }
    }
  }

  function Load(options) {
    if (!options.url) {
      throw "LoadError: url are missing";
    }

    if (!options.type) {
      options.type = "text";
    }

    //short url
    options.url = CleanPath(options.url);

    //loading file are already ask
    var cache;
    if (AppCache[options.url] && (!options.nocache || AppCache[options.url].state !== "loaded")) {
      cache = AppCache[options.url];
      if (cache.state === "loading") {
        cache.listeners.push(options);//one loading are usefull
      }
      if (cache.state === "loaded") {
        //files already loaded
        if (cache.type === "script" && !cache.isEval) {
          cache.isEval = true;
          cache.stack = eval.apply(window, [cache.file]);
        }
        options.success(cache.file, options);
      }
      if (cache.state === "error" && options.error) {
        options.error(cache.event, options);//last loading fail
      }
      return;
    }
    //local storage
    if (addCacheFromLocalStorage(options.url)) {
      cache = AppCache[options.url];
      options.success(cache.file, options);
      return;
    }

    //first loading
    addCache(options.url);
    AppCache[options.url].listeners.push(options);
    AppCache[options.url].type = options.type;

    var xhr = new XMLHttpRequest();
    xhr.url = options.url;
    xhr.addEventListener("load", onXHRSuccess, false);
    xhr.addEventListener("error", onXHRError, false);
    xhr.addEventListener("progress", onXHRProgress, false);

    xhr.open("GET", options.url);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(null);
    return xhr;
  };


  function onImportSuccess(file, options) {
    var stack = options.stack;
    //When a file loaded
    function onStackComplete() {
      stack.cmp++;
      //if all dependencies loaded
      if (stack.cmp === stack.total) {
        stack.complete = true;
        if (stack.callback) {
          stack.result = stack.callback.apply(null, getAllResult(options.orders || []));
        }
        for (var i = 0; i < stack.listeners.length; i++) {
          stack.listeners[i]();
        }
      }
    }
    //The loaded file is in cache
    var cache = AppCache[options.url];
    var deep = cache.stack;
    //if file have dependencies
    if (deep && deep.listeners && deep.complete === false) {
      deep.listeners.push(onStackComplete);
    }
    else {
      onStackComplete();
    }
  }

  function Import(orders, callback) {
    var stack = {
      total: orders.length,
      cmp: 0,
      callback: callback,
      listeners: [],
      complete: false,
      label: '',
      result: undefined,
    };

    if (stack.total === 0) {
      stack.complete = true;
      if (callback) {
        stack.result = stack.callback.apply(null, getAllResult(orders));
      }
    } else {
      var url, type;
      for (var i = 0; i < stack.total; i++) {
        url = orders[i];
        type = "script";
        if (url.indexOf('[js]') === -1) {
          url = url;
          type = 'text';
        }
        Load({
          url: url,
          type: type,
          success: onImportSuccess,
          stack: stack,
          orders
        });
      }
    }
    return stack;
  }
  window.Import = Import;
})();

