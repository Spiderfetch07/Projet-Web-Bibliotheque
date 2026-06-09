Import([], function () {
  var Auth = {
    isLoggedIn: function () {
      return sessionStorage.getItem('auth') === 'true';
    },
    login: function () {
      sessionStorage.setItem('auth', 'true');
    },
    logout: function () {
      sessionStorage.removeItem('auth');
    }
  };
  return Auth;
});
