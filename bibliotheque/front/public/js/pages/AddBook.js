Import([
  '[html]/pages/add-book.html',
  '[js]/com/Api.js',
  '[js]/com/Router.js',
], function (tpl, Api, Router) {

  class AddBook {
    element = null;

    constructor(element) {
      this.element = element;
      this.element.innerHTML = tpl;

      var self = this;
      var msg = this.element.querySelector('#msg');
      var titleInput = this.element.querySelector('#book-title');
      var authorSelect = this.element.querySelector('#book-author');
      var statusSelect = this.element.querySelector('#book-status');
      var submitBtn = this.element.querySelector('#submit-btn');

      // Load authors into select
      Api.get('/api/author/').then(function (res) {
        var authors = res.data || [];
        authors.forEach(function (a) {
          var opt = document.createElement('option');
          opt.value = a.id;
          opt.textContent = a.name;
          authorSelect.appendChild(opt);
        });
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

        Api.post('/api/book/', { title: title, authorId: authorId, status: status }).then(function (res) {
          if (res.data && res.data.id !== undefined) {
            msg.className = 'success-msg';
            msg.textContent = 'Livre créé avec succès !';
            titleInput.value = '';
            authorSelect.selectedIndex = 0;
            statusSelect.selectedIndex = 0;
          } else {
            msg.className = 'error-msg';
            msg.textContent = 'Erreur lors de la création.';
          }
        });
      });
    }
  }

  return AddBook;
});
