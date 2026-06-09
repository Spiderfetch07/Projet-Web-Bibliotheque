Import([], function () {
  var Router = {
    navigate: function (page, params) {
      var event = new CustomEvent('navigate', { detail: { page: page, params: params || {} } });
      window.dispatchEvent(event);
    },
    onNavigate: function (callback) {
      window.addEventListener('navigate', function (e) {
        callback(e.detail.page, e.detail.params);
      });
    }
  };
  return Router;
});
