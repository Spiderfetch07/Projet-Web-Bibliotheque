const BookModel = require('../models/BookModel');
const AuthorModel = require('../models/AuthorModel');

class DashboardController {
  getStats(query, body) {
    const books = BookModel.getAll();
    const authors = AuthorModel.getAll();
    const borrowed = books.filter(b => b.status === 'borrowed').length;
    return {
      totalBooks: books.length,
      totalAuthors: authors.length,
      borrowedBooks: borrowed,
    };
  }

  routes = [
    { url: '/api/dashboard/', handler: this.getStats.bind(this), method: 'GET' },
  ];
}

module.exports = new DashboardController();
