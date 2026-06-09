const Database = require('../core/Database');

class AuthorModel {
  getAll() {
    return Database.getFile('authors') || [];
  }

  getById(id) {
    return Database.get('authors', id);
  }

  search(name) {
    const authors = Database.getFile('authors') || [];
    if (!name) return authors;
    return authors.filter(a => a.name.toLowerCase().includes(name.toLowerCase()));
  }

  create(name) {
    const file = Database.getFile('authors') || [];
    const id = file.length;
    Database.edit('authors', id, { id, name });
    return id;
  }

  edit(id, data) {
    const old = Database.get('authors', id);
    if (old === false) return false;
    Database.edit('authors', id, { ...old, ...data, id });
    return Database.get('authors', id);
  }
}

module.exports = new AuthorModel();
