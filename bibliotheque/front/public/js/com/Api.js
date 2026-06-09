Import([], function () {
  var API_BASE = '';

  var Api = {
    get: function (endpoint, params) {
      var url = API_BASE + endpoint;
      if (params) {
        var qs = Object.keys(params).map(function (k) {
          return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
        }).join('&');
        url += '?' + qs;
      }
      return fetch(url).then(function (r) { return r.json(); });
    },
    post: function (endpoint, data) {
      return fetch(API_BASE + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) { return r.json(); });
    },
    put: function (endpoint, params, data) {
      var url = API_BASE + endpoint;
      if (params) {
        var qs = Object.keys(params).map(function (k) {
          return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
        }).join('&');
        url += '?' + qs;
      }
      return fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) { return r.json(); });
    }
  };

  return Api;
});
