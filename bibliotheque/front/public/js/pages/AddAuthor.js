Import([
  '[html]/pages/add-author.html',
  '[js]/com/Api.js',
], function (tpl, Api) {

  class AddAuthor {
    element = null;

    constructor(element) {
      this.element = element;
      this.element.innerHTML = tpl;

      var msg = this.element.querySelector('#msg');
      var nameInput = this.element.querySelector('#author-name');
      var submitBtn = this.element.querySelector('#submit-btn');

      submitBtn.addEventListener('click', function () {
        msg.className = '';
        msg.textContent = '';
        var name = nameInput.value.trim();

        if (!name) {
          msg.className = 'error-msg';
          msg.textContent = 'Le nom est requis.';
          return;
        }

        Api.post('/api/author/', { name: name }).then(function (res) {
          if (res.data && res.data.id !== undefined) {
            msg.className = 'success-msg';
            msg.textContent = 'Auteur créé avec succès !';
            nameInput.value = '';
          } else {
            msg.className = 'error-msg';
            msg.textContent = 'Erreur lors de la création.';
          }
        });
      });
    }
  }

  return AddAuthor;
});
