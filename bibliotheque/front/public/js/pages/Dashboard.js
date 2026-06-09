Import([
  '[html]/pages/dashboard.html',
  '[js]/com/Api.js',
], function (tpl, Api) {

  class Dashboard {
    element = null;

    constructor(element) {
      this.element = element;
      this.element.innerHTML = tpl;
      this.loadStats();
    }

    loadStats() {
      var self = this;
      Api.get('/api/dashboard/').then(function (res) {
        if (res.data) {
          var d = res.data;
          self.element.querySelector('#stat-books').textContent = d.totalBooks;
          self.element.querySelector('#stat-authors').textContent = d.totalAuthors;
          self.element.querySelector('#stat-borrowed').textContent = d.borrowedBooks;
        }
      });
    }
  }

  return Dashboard;
});
