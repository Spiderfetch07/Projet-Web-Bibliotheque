Import([
  '[js]/com/Auth.js',
  '[js]/com/Router.js',
  '[js]/com/Sidebar.js',
  '[html]/layout.html',

  '[js]/pages/Login.js',
  '[js]/pages/Dashboard.js',
  '[js]/pages/SearchBook.js',
  '[js]/pages/SearchAuthor.js',
  '[js]/pages/AddBook.js',
  '[js]/pages/AddAuthor.js',
  '[js]/pages/EditBook.js',
  '[js]/pages/EditAuthor.js',
], function (
  Auth, Router, Sidebar, layoutTpl,
  Login, Dashboard, SearchBook, SearchAuthor,
  AddBook, AddAuthor, EditBook, EditAuthor
) {
  var root = document.getElementById('root');
  var currentPage = null;
  var sidebar = null;

  function showLogin() {
    root.innerHTML = '';
    currentPage = new Login(root);
  }

  function showApp(page, params) {
    if (!Auth.isLoggedIn()) { showLogin(); return; }

    // First time: build layout
    if (!document.getElementById('main')) {
      root.innerHTML = layoutTpl;
      var sidebarNode = document.getElementById('sidebar');
      sidebar = new Sidebar(sidebarNode);
    }

    var mainNode = document.getElementById('main');
    mainNode.innerHTML = '';

    if (sidebar) sidebar.setActive(page);

    if (page === 'dashboard') { currentPage = new Dashboard(mainNode); }
    else if (page === 'search-book') { currentPage = new SearchBook(mainNode); }
    else if (page === 'search-author') { currentPage = new SearchAuthor(mainNode); }
    else if (page === 'add-book') { currentPage = new AddBook(mainNode); }
    else if (page === 'add-author') { currentPage = new AddAuthor(mainNode); }
    else if (page === 'edit-book') { currentPage = new EditBook(mainNode, params); }
    else if (page === 'edit-author') { currentPage = new EditAuthor(mainNode, params); }
    else { currentPage = new Dashboard(mainNode); }
  }

  Router.onNavigate(function (page, params) {
    if (page === 'login') { Auth.logout(); root.innerHTML = ''; showLogin(); return; }
    showApp(page, params);
  });

  // Initial route
  if (Auth.isLoggedIn()) {
    showApp('dashboard');
  } else {
    showLogin();
  }
});
