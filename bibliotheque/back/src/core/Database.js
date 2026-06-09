const path = require('path');
const fs = require('fs-extra');

class Database {
  basePath = 'data';

  getFile(filename) {
    const filePath = path.resolve(this.basePath + '/' + filename + '.json');
    if (fs.existsSync(filePath)) {
      const buffer = fs.readFileSync(filePath);
      if (buffer) {
        try {
          return JSON.parse(buffer.toString());
        } catch (err) {
          console.error(err);
        }
      }
    }
    return false;
  }

  editFile(filename, value) {
    const filePath = path.resolve(this.basePath + '/' + filename + '.json');
    try {
      fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
      return true;
    } catch (err) {
      console.error(err);
    }
    return false;
  }

  get(filename, id) {
    const json = this.getFile(filename);
    if (json && json[id] !== undefined) return json[id];
    return false;
  }

  edit(filename, id, value) {
    let json = this.getFile(filename);
    if (json) { json[id] = value; } else { json = [value]; }
    return this.editFile(filename, json);
  }

  delete(filename, id) {
    let json = this.getFile(filename);
    if (json && json[id] !== undefined) {
      json.splice(id, 1);
      json = json.map((item, index) => ({ ...item, id: index }));
      return this.editFile(filename, json);
    }
    return true;
  }
}

module.exports = new Database();
