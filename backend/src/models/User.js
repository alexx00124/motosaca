const db = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  constructor(id, name, password_hash) {
    this.id = id;
    this.name = name;
    this.password_hash = password_hash;
  }

  // Crear nuevo usuario
  static async create(name, password) {
    return new Promise(async (resolve, reject) => {
      try {
        // Hash de la contraseña
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        db.run(
          "INSERT INTO users (name, password_hash) VALUES (?, ?)",
          [name, password_hash],
          function(err) {
            if (err) {
              reject(err);
            } else {
              resolve({
                id: this.lastID,
                name: name,
                message: 'Usuario creado exitosamente'
              });
            }
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  // Buscar usuario por nombre
  static findByName(name) {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM users WHERE name = ?",
        [name],
        (err, row) => {
          if (err) {
            reject(err);
          } else if (row) {
            resolve(new User(row.id, row.name, row.password_hash));
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  // Buscar usuario por ID
  static findById(id) {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM users WHERE id = ?",
        [id],
        (err, row) => {
          if (err) {
            reject(err);
          } else if (row) {
            resolve(new User(row.id, row.name, row.password_hash));
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  // Verificar contraseña
  async verifyPassword(password) {
    try {
      return await bcrypt.compare(password, this.password_hash);
    } catch (error) {
      throw error;
    }
  }

  // Obtener todos los usuarios (para admin)
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT id, name, created_at FROM users",
        [],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }
}

module.exports = User;  