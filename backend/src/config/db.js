// seed.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../tienda_virtual.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.message);
  } else {
    console.log('Conectado a SQLite database');
  }
});

// Ejecutar en serie para asegurar orden
db.serialize(() => {
  // 1) Crear tablas (si no existen)
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS catalog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT,
      image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      total_price REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // 2) Verificar si la tabla catalog está vacía y siembrar si corresponde
  db.get("SELECT COUNT(*) AS count FROM catalog", (err, row) => {
    if (err) {
      console.error('Error comprobando catalog:', err.message);
      db.close();
      return;
    }

    if (row && row.count === 0) {
      const productos = [
        ["Royal Enfield Classic 350", 9000000, "Llantas nuevas, venpermuta, defensa de motor y carrocería, precio negociable.", "https://www.cycleworld.com/resizer/MWhJIVMjVfOjJj_ECWzEKFXcffI=/arc-photo-octane/arc3-prod/public/RGGAIGLKHNB4BNVCJ5N7VMDNA4.jpg"],
        ["BMW S1000R 2022", 87000000, "Peritaje donde desee, no tiene caídas ni reclamaciones.", "https://www.cycleworld.com/resizer/MWhJIVMjVfOjJj_ECWzEKFXcffI=/arc-photo-octane/arc3-prod/public/RGGAIGLKHNB4BNVCJ5N7VMDNA4.jpg"],
        ["AKT Flex 125 2025", 5200000, "Equipo Motai disponible para darte la mejor opción.", "https://images.ctfassets.net/8zlbnewncp6f/7HcbyZ39RF2CnlB4mW56s5/0fe0e8d218674d155e078fbc61ba8323/AKT_FLEX_LED_125-5-Galgo_Colombia.webp"]
      ];

      const stmt = db.prepare("INSERT INTO catalog (name, price, description, image) VALUES (?, ?, ?, ?)");
      productos.forEach(p => stmt.run(p[0], p[1], p[2], p[3], (err) => {
        if (err) console.error('Error insertando producto:', err.message);
      }));
      stmt.finalize((err) => {
        if (err) console.error('Error finalizando statement:', err.message);
        else console.log('Productos de ejemplo insertados correctamente.');
        db.close();
      });
    } else {
      console.log('La tabla catalog ya tiene datos. No se inserta seed.');
      db.close();
    }
  });
});

module.exports = db;
