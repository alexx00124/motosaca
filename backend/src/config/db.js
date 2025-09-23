const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ruta al archivo de base de datos
const dbPath = path.join(__dirname, '../../tienda_virtual.db');

// Crear conexión a SQLite
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.message);
  } else {
    console.log('Conectado a SQLite database');
  }
});

// Crear las tablas si no existen
const createTables = () => {
  // Tabla users
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creando tabla users:', err.message);
    } else {
      console.log('Tabla users creada o ya existe');
    }
  });

  // Tabla catalog
  db.run(`
    CREATE TABLE IF NOT EXISTS catalog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      description TEXT,
      image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creando tabla catalog:', err.message);
    } else {
      console.log('Tabla catalog creada o ya existe');
    }
  });

  // Tabla sales
  db.run(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      total_price DECIMAL(10,2) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creando tabla sales:', err.message);
    } else {
      console.log('Tabla sales creada o ya existe');
    }
  });

  // Insertar algunos productos de ejemplo si la tabla está vacía
  db.get("SELECT COUNT(*) as count FROM catalog", (err, row) => {
    if (!err && row.count === 0) {
      const productos = [
        ['Producto 1', 29.99, 'Descripción del producto 1', 'imagen1.jpg'],
        ['Producto 2', 49.99, 'Descripción del producto 2', 'imagen2.jpg'],
        ['Producto 3', 19.99, 'Descripción del producto 3', 'imagen3.jpg']
      ];

      productos.forEach(producto => {
        db.run(
          "INSERT INTO catalog (name, price, description, image) VALUES (?, ?, ?, ?)",
          producto,
          (err) => {
            if (err) {
              console.error('Error insertando producto:', err.message);
            }
          }
        );
      });
      console.log('Productos de ejemplo insertados');
    }
  });
};

// Ejecutar creación de tablas
createTables();

module.exports = db;