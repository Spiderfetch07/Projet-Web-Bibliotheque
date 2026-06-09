Import([
  '[html]/pages/search-book.html',
  '[js]/com/Api.js',
  '[js]/com/Router.js',
], function (tpl, Api, Router) {

  class SearchBook {
    element = null;

    constructor(element) {
      this.element = element;
      this.element.innerHTML = tpl;

      var self = this;
      var tbody = this.element.querySelector('#books-tbody');
      var searchInput = this.element.querySelector('#search-input');
      var searchBtn = this.element.querySelector('#search-btn');

      function loadBooks(search) {
        var params = search ? { search: search } : {};
        Api.get('/api/book/', params).then(function (res) {
          var books = res.data || [];
          if (!books.length) {
            tbody.innerHTML = '<tr><td colspan="3">Aucun livre trouvé.</td></tr>';
            return;
          }
          // Fetch authors to map names
          Api.get('/api/author/').then(function (aRes) {
            var authors = aRes.data || [];
            var authorMap = {};
            authors.forEach(function (a) { authorMap[a.id] = a.name; });

            tbody.innerHTML = books.map(function (b) {
              var authorName = authorMap[b.authorId] || '—';
              var statusClass = b.status === 'borrowed' ? 'status-borrowed' : 'status-available';
              var statusLabel = b.status === 'borrowed' ? 'emprunté' : 'en stock';
              return '<tr><td><a data-id="' + b.id + '">' + b.title + '</a></td>' +
                '<td>' + authorName + '</td>' +
                '<td class="' + statusClass + '">' + statusLabel + '</td></tr>';
            }).join('');

            // Click on book
            tbody.querySelectorAll('a[data-id]').forEach(function (a) {
              a.addEventListener('click', function () {
                Router.navigate('edit-book', { id: parseInt(a.getAttribute('data-id'), 10) });
              });
            });
          });
        });
      }

      searchBtn.addEventListener('click', function () {
        loadBooks(searchInput.value.trim());
      });

      searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') loadBooks(searchInput.value.trim());
      });

      loadBooks();
    }
  }

  return SearchBook;
});
