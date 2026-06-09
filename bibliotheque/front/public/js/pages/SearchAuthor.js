Import([
  '[html]/pages/search-author.html',
  '[js]/com/Api.js',
  '[js]/com/Router.js',
], function (tpl, Api, Router) {

  class SearchAuthor {
    element = null;

    constructor(element) {
      this.element = element;
      this.element.innerHTML = tpl;

      var self = this;
      var tbody = this.element.querySelector('#authors-tbody');
      var searchInput = this.element.querySelector('#search-input');
      var searchBtn = this.element.querySelector('#search-btn');

      function loadAuthors(search) {
        var params = search ? { search: search } : {};
        Api.get('/api/author/', params).then(function (res) {
          var authors = res.data || [];
          if (!authors.length) {
            tbody.innerHTML = '<tr><td colspan="2">Aucun auteur trouvé.</td></tr>';
            return;
          }
          tbody.innerHTML = authors.map(function (a) {
            return '<tr><td><a data-id="' + a.id + '">' + a.name + '</a></td>' +
              '<td>' + (a.bookCount || 0) + '</td></tr>';
          }).join('');

          tbody.querySelectorAll('a[data-id]').forEach(function (a) {
            a.addEventListener('click', function () {
              Router.navigate('edit-author', { id: parseInt(a.getAttribute('data-id'), 10) });
            });
          });
        });
      }

      searchBtn.addEventListener('click', function () {
        loadAuthors(searchInput.value.trim());
      });

      searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') loadAuthors(searchInput.value.trim());
      });

      loadAuthors();
    }
  }

  return SearchAuthor;
});
