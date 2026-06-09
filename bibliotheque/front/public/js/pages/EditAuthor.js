Import([
  '[html]/pages/edit-author.html',
  '[js]/com/Api.js',
  '[js]/com/Router.js',
], function (tpl, Api, Router) {

  class EditAuthor {
    element = null;

    constructor(element, params) {
      this.element = element;
      this.element.innerHTML = tpl;

      var msg = this.element.querySelector('#msg');
      var nameInput = this.element.querySelector('#author-name');
      var submitBtn = this.element.querySelector('#submit-btn');
      var tbody = this.element.querySelector('#books-tbody');

      var authorId = params && params.id !== undefined ? params.id : null;

      if (authorId !== null) {
        Api.get('/api/author/', { id: authorId }).then(function (res) {
          var author = res.data;
          if (author) {
            nameInput.value = author.name || '';
            var books = author.books || [];
            if (!books.length) {
              tbody.innerHTML = '<tr><td colspan="2">Aucun livre.</td></tr>';
            } else {
              tbody.innerHTML = books.map(function (b) {
                var statusClass = b.status === 'borrowed' ? 'status-borrowed' : 'status-available';
                var statusLabel = b.status === 'borrowed' ? 'emprunté' : 'en stock';
                return '<tr><td><a data-id="' + b.id + '">' + b.title + '</a></td>' +
                  '<td class="' + statusClass + '">' + statusLabel + '</td></tr>';
              }).join('');

              tbody.querySelectorAll('a[data-id]').forEach(function (a) {
                a.addEventListener('click', function () {
                  Router.navigate('edit-book', { id: parseInt(a.getAttribute('data-id'), 10) });
                });
              });
            }
          }
        });
      }

      submitBtn.addEventListener('click', function () {
        msg.className = '';
        msg.textContent = '';
        var name = nameInput.value.trim();

        if (!name) {
          msg.className = 'error-msg';
          msg.textContent = 'Le nom est requis.';
          return;
        }

        Api.put('/api/author/', { id: authorId }, { name: name }).then(function (res) {
          if (res.data) {
            msg.className = 'success-msg';
            msg.textContent = 'Auteur modifié avec succès !';
          } else {
            msg.className = 'error-msg';
            msg.textContent = 'Erreur lors de la modification.';
          }
        });
      });
    }
  }

  return EditAuthor;
});
