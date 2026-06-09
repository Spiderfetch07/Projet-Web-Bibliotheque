Import([
  '[html]/pages/login.html',
  '[js]/com/Api.js',
  '[js]/com/Auth.js',
  '[js]/com/Router.js',
], function (tpl, Api, Auth, Router) {

  class Login {
    element = null;

    constructor(element) {
      this.element = element;
      this.element.innerHTML = tpl;

      var btn = this.element.querySelector('#login-btn');
      var errorEl = this.element.querySelector('#login-error');

      btn.addEventListener('click', function () {
        var login = document.getElementById('login-input').value.trim();
        var password = document.getElementById('password-input').value;
        errorEl.style.display = 'none';

        Api.post('/api/login/', { login: login, password: password }).then(function (res) {
          if (res.data && res.data.success) {
            Auth.login();
            Router.navigate('dashboard');
          } else {
            errorEl.textContent = 'Identifiant ou mot de passe incorrect.';
            errorEl.style.display = 'block';
          }
        }).catch(function () {
          errorEl.textContent = 'Erreur de connexion au serveur.';
          errorEl.style.display = 'block';
        });
      });

      // Enter key support
      this.element.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') btn.click();
      });
    }
  }

  return Login;
});
