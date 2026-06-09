const AuthorModel = require('../models/AuthorModel');
const BookModel = require('../models/BookModel');

class AuthorController {
  getAuthor(query, body) {
    if (query && query.id !== undefined) {
      const id = parseInt(query.id, 10);
      if (!Number.isNaN(id)) {
        const author = AuthorModel.getById(id);
        if (!author) return false;
        const books = BookModel.getAll().filter(b => b.authorId === id);
        return { ...author, books };
      }
    }
    if (query && query.search !== undefined) {
      const authors = AuthorModel.search(query.search);
      return authors.map(a => ({
        ...a,
        bookCount: BookModel.getAll().filter(b => b.authorId === a.id).length
      }));
    }
    const authors = AuthorModel.getAll();
    return authors.map(a => ({
      ...a,
      bookCount: BookModel.getAll().filter(b => b.authorId === a.id).length
    }));
  }

  postAuthor(query, body) {
    const { name } = body;
    if (!name) return { error: 'name required' };
    const id = AuthorModel.create(name);
    return { id };
  }

  putAuthor(query, body) {
    if (!query || query.id === undefined) return false;
    const id = parseInt(query.id, 10);
    if (Number.isNaN(id)) return false;
    const { name } = body;
    if (!name) return false;
    return AuthorModel.edit(id, { name });
  }

  routes = [
    { url: '/api/author/', handler: this.getAuthor.bind(this), method: 'GET' },
    { url: '/api/author/', handler: this.postAuthor.bind(this), method: 'POST' },
    { url: '/api/author/', handler: this.putAuthor.bind(this), method: 'PUT' },
  ];
}

module.exports = new AuthorController();
