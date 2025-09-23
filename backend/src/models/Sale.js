const db = require('../config/db');

class Sale {
  constructor(id, user_id, total_price, created_at) {
    this.id = id;
    this.user_id = user_id;
    this.total_price = total_price;
    this.created_at = created_at;
  }

  // Crear nueva venta
  static create(user_id, total_price) {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO sales (user_id, total_price) VALUES (?, ?)",
        [user_id, total_price],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              id: this.lastID,
              user_id: user_id,
              total_price: total_price,
              message: 'Venta registrada exitosamente'
            });
          }
        }
      );
    });
  }

  // Obtener todas las ventas
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT s.*, u.name as user_name 
         FROM sales s 
         LEFT JOIN users u ON s.user_id = u.id 
         ORDER BY s.created_at DESC`,
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

  // Obtener ventas por usuario
  static getByUserId(user_id) {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM sales WHERE user_id = ? ORDER BY created_at DESC",
        [user_id],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const sales = rows.map(row => 
              new Sale(row.id, row.user_id, row.total_price, row.created_at)
            );
            resolve(sales);
          }
        }
      );
    });
  }

  // Buscar venta por ID
  static findById(id) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT s.*, u.name as user_name 
         FROM sales s 
         LEFT JOIN users u ON s.user_id = u.id 
         WHERE s.id = ?`,
        [id],
        (err, row) => {
          if (err) {
            reject(err);
          } else if (row) {
            resolve({
              id: row.id,
              user_id: row.user_id,
              user_name: row.user_name,
              total_price: row.total_price,
              created_at: row.created_at
            });
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  // Obtener estadísticas de ventas
  static getStats() {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT 
           COUNT(*) as total_sales,
           SUM(total_price) as total_revenue,
           AVG(total_price) as average_sale,
           MAX(total_price) as highest_sale,
           MIN(total_price) as lowest_sale
         FROM sales`,
        [],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  }
}

module.exports = Sale;