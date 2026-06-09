const Database = require('../core/Database');

class BookModel {
  getAll() {
    return Database.getFile('books') || [];
  }

  getById(id) {
    return Database.get('books', id);
  }

  search(name) {
    const books = Database.getFile('books') || [];
    if (!name) return books;
    return books.filter(b => b.title.toLowerCase().includes(name.toLowerCase()));
  }

  create(title, authorId, status) {
    const file = Database.getFile('books') || [];
    const id = file.length;
    Database.edit('books', id, { id, title, authorId, status: status || 'available' });
    return id;
  }

  edit(id, data) {
    const old = Database.get('books', id);
    if (old === false) return false;
    Database.edit('books', id, { ...old, ...data, id });
    return Database.get('books', id);
  }
}

module.exports = new BookModel();
