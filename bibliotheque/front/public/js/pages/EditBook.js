Import([
  '[html]/pages/edit-book.html',
  '[js]/com/Api.js',
  '[js]/com/Router.js',
], function (tpl, Api, Router) {

  class EditBook {
    element = null;

    constructor(element, params) {
      this.element = element;
      this.element.innerHTML = tpl;

      var msg = this.element.querySelector('#msg');
      var titleInput = this.element.querySelector('#book-title');
      var authorSelect = this.element.querySelector('#book-author');
      var statusSelect = this.element.querySelector('#book-status');
      var submitBtn = this.element.querySelector('#submit-btn');

      var bookId = params && params.id !== undefined ? params.id : null;

      // Load authors then book data
      Api.get('/api/author/').then(function (aRes) {
        var authors = aRes.data || [];
        authors.forEach(function (a) {
          var opt = document.createElement('option');
          opt.value = a.id;
          opt.textContent = a.name;
          authorSelect.appendChild(opt);
        });

        if (bookId !== null) {
          Api.get('/api/book/', { id: bookId }).then(function (res) {
            var book = res.data;
            if (book) {
              titleInput.value = book.title || '';
              authorSelect.value = book.authorId !== undefined ? book.authorId : '';
              statusSelect.value = book.status || 'available';
            }
          });
        }
      });

      submitBtn.addEventListener('click', function () {
        msg.className = '';
        msg.textContent = '';
        var title = titleInput.value.trim();
        var authorId = authorSelect.value;
        var status = statusSelect.value;

        if (!title) {
          msg.className = 'error-msg';
          msg.textContent = 'Le titre est requis.';
          return;
        }

        Api.put('/api/book/', { id: bookId }, { title: title, authorId: authorId, status: status }).then(function (res) {
          if (res.data) {
            msg.className = 'success-msg';
            msg.textContent = 'Livre modifié avec succès !';
          } else {
            msg.className = 'error-msg';
            msg.textContent = 'Erreur lors de la modification.';
          }
        });
      });
    }
  }

  return EditBook;
});
