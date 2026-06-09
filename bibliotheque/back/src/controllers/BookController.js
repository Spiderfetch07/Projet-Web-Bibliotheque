const BookModel = require('../models/BookModel');

class BookController {
  getBook(query, body) {
    if (query && query.id !== undefined) {
      const id = parseInt(query.id, 10);
      if (!Number.isNaN(id)) return BookModel.getById(id);
    }
    if (query && query.search !== undefined) {
      return BookModel.search(query.search);
    }
    return BookModel.getAll();
  }

  postBook(query, body) {
    const { title, authorId, status } = body;
    if (!title) return { error: 'title required' };
    const id = BookModel.create(title, parseInt(authorId, 10), status);
    return { id };
  }

  putBook(query, body) {
    if (!query || query.id === undefined) return false;
    const id = parseInt(query.id, 10);
    if (Number.isNaN(id)) return false;
    const { title, authorId, status } = body;
    const updated = BookModel.edit(id, {
      ...(title !== undefined && { title }),
      ...(authorId !== undefined && { authorId: parseInt(authorId, 10) }),
      ...(status !== undefined && { status }),
    });
    return updated;
  }

  routes = [
    { url: '/api/book/', handler: this.getBook.bind(this), method: 'GET' },
    { url: '/api/book/', handler: this.postBook.bind(this), method: 'POST' },
    { url: '/api/book/', handler: this.putBook.bind(this), method: 'PUT' },
  ];
}

module.exports = new BookController();
