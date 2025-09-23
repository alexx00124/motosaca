const db = require('../config/db');

class Catalog {
  constructor(id, name, price, description, image) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
    this.image = image;
  }

  // Obtener todos los productos del catálogo
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM catalog ORDER BY id ASC",
        [],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const products = rows.map(row => 
              new Catalog(row.id, row.name, row.price, row.description, row.image)
            );
            resolve(products);
          }
        }
      );
    });
  }

  // Buscar producto por ID
  static findById(id) {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM catalog WHERE id = ?",
        [id],
        (err, row) => {
          if (err) {
            reject(err);
          } else if (row) {
            resolve(new Catalog(row.id, row.name, row.price, row.description, row.image));
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  // Buscar múltiples productos por IDs
  static findByIds(ids) {
    return new Promise((resolve, reject) => {
      if (!ids || ids.length === 0) {
        resolve([]);
        return;
      }

      const placeholders = ids.map(() => '?').join(',');
      const query = `SELECT * FROM catalog WHERE id IN (${placeholders})`;

      db.all(query, ids, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const products = rows.map(row => 
            new Catalog(row.id, row.name, row.price, row.description, row.image)
          );
          resolve(products);
        }
      });
    });
  }

  // Crear nuevo producto
  static create(name, price, description, image) {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO catalog (name, price, description, image) VALUES (?, ?, ?, ?)",
        [name, price, description, image],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              id: this.lastID,
              name: name,
              price: price,
              description: description,
              image: image,
              message: 'Producto creado exitosamente'
            });
          }
        }
      );
    });
  }

  // Actualizar producto
  static update(id, name, price, description, image) {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE catalog SET name = ?, price = ?, description = ?, image = ? WHERE id = ?",
        [name, price, description, image, id],
        function(err) {
          if (err) {
            reject(err);
          } else if (this.changes === 0) {
            reject(new Error('Producto no encontrado'));
          } else {
            resolve({
              id: id,
              name: name,
              price: price,
              description: description,
              image: image,
              message: 'Producto actualizado exitosamente'
            });
          }
        }
      );
    });
  }

  // Eliminar producto
  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run(
        "DELETE FROM catalog WHERE id = ?",
        [id],
        function(err) {
          if (err) {
            reject(err);
          } else if (this.changes === 0) {
            reject(new Error('Producto no encontrado'));
          } else {
            resolve({ message: 'Producto eliminado exitosamente' });
          }
        }
      );
    });
  }
}

module.exports = Catalog;