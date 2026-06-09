Import([
  '[html]/com/sidebar.html',
  '[js]/com/Auth.js',
  '[js]/com/Router.js',
], function (tpl, Auth, Router) {

  class Sidebar {
    element = null;

    constructor(element) {
      this.element = element;
      this.element.className = 'sidebar';
      this.element.innerHTML = tpl;

      var links = this.element.querySelectorAll('a[data-page]');
      links.forEach(function (link) {
        link.addEventListener('click', function () {
          Router.navigate(link.getAttribute('data-page'));
        });
      });

      var logoutBtn = this.element.querySelector('#logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
          Auth.logout();
          Router.navigate('login');
        });
      }
    }

    setActive(page) {
      var links = this.element.querySelectorAll('a[data-page]');
      links.forEach(function (link) {
        if (link.getAttribute('data-page') === page) {
          link.style.background = 'rgba(255,255,255,0.18)';
        } else {
          link.style.background = '';
        }
      });
    }
  }

  return Sidebar;
});
