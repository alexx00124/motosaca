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

// Función para insertar motos si la tabla está vacía
const insertMotosIfEmpty = () => {
  db.get("SELECT COUNT(*) as count FROM catalog", (err, row) => {
    if (err) {
      console.error('Error consultando catalog:', err.message);
      return;
    }

    if (!row || row.count === 0) {
      console.log('Insertando motos reales en el catálogo...');
      
      const motos = [
        ['Royal Enfield Classic 350', 16500000, 'Moto clásica vintage con motor 349cc, llantas nuevas, defensa de motor incluida. Revisión técnico-mecánica al día.', 'https://royalenfieldco.com/wp-content/uploads/2024/10/banner_latetal_green_classic_350.webp'],
        
        ['BMW S1000RR 2023', 95000000, 'Superbike de alto rendimiento, motor 999cc, 205HP. Sin caídas, mantenimiento en concesionario BMW.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_aSKYnUM9jSOmm1GMfoCDIZXT8s126OPT-g&s'],
        
        ['Yamaha MT-07 2024', 28500000, 'Naked deportiva 689cc, perfecta combinación entre potencia y agilidad. 0 km, garantía de fábrica.', 'https://images.ctfassets.net/8zlbnewncp6f/4NKm8K5g21l1q8VhmAhd2U/f9f1d8ae0210613e9262cacc55d7f69b/Yamaha_MT_07_2024_Galeria_2.jpg?w=320&h=320&fit=pad&fm=webp&q=95'],
        
        ['Honda CB650R 2023', 32000000, 'Naked premium con motor 649cc de 4 cilindros. Tecnología VTEC, frenos Nissin, suspensión Showa.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiUkRPmzb9qzh1hQHzQHB0LDWAJuZck_aooA&s'],
        
        ['KTM Duke 390 2024', 22000000, 'Naked de alta gama con motor 373cc, TFT display, ABS, control de tracción. Perfecta para ciudad.', 'https://web2.fireboldweb.com/wp-content/uploads/2023/11/PHO_BIKE_90_RE_MY24-KTM-390-DUKE-90-RIGHT-side_SALL_AEPI_V1.webp'],
        
        ['Suzuki GSX-R750 2022', 48000000, 'Deportiva pura con motor 750cc, perfecta para pista y carretera. Pocos kilómetros, llantas nuevas.', 'https://dhqlmcogwd1an.cloudfront.net/images/phocagallery/Suzuki/gsx-r750-2024/11-suzuki-gsx-r750-2024-estudio-blanco-02.jpg'],
        
        ['Kawasaki Ninja 400 2023', 24500000, 'Deportiva de entrada con motor 399cc bicilíndrico. ABS, instrumentos digitales, ideal principiantes.', 'https://casaexito.com/wp-content/uploads/2023/08/NINJA-400-ABS-235.jpg'],
        
        ['Ducati Monster 821 2022', 52000000, 'Naked italiana con motor L-twin 821cc, chasis de acero tubular. Suspensiones totalmente ajustables.', 'https://www.ducaticolombia.co/wp-content/uploads/2023/03/monsterSPimg-1.png'],
        
        ['Triumph Street Triple 765 RS', 65000000, 'Triple cilindros 765cc, 123HP, suspensiones Ohlins, frenos Brembo. Máquina de diversión pura.', 'https://www.cycleworld.com/resizer/yfsPOUR339QFIc1CPA4ykukGxEI=/1440x0/filters:focal(726x543:736x553)/cloudfront-us-east-1.images.arcpublishing.com/octane/UMAEHOQO55GWXFPIFP2MYGPGHA.jpg'],
        
        ['Harley Davidson Iron 883', 58000000, 'Cruiser clásica con motor Evolution 883cc, estilo Sportster auténtico. Escape Vance & Hines incluido.', 'https://d2bywgumb0o70j.cloudfront.net/2019/08/22/0e1191a48bd9296f173ac1c36bb815da_77dae876625a15f4.jpg']
      ];

      let insertedCount = 0;
      motos.forEach((moto, index) => {
        db.run(
          "INSERT INTO catalog (name, price, description, image) VALUES (?, ?, ?, ?)",
          moto,
          function(err) {
            if (err) {
              console.error(`❌ Error insertando moto ${index + 1}:`, err.message);
            } else {
              insertedCount++;
              console.log(`✅ Insertada: ${moto[0]} - $${moto[1].toLocaleString('es-CO')}`);
            }
            
            // Si es la última moto, mostrar resumen
            if (index === motos.length - 1) {
              console.log(`🎉 ${insertedCount}/${motos.length} motos insertadas exitosamente`);
            }
          }
        );
      });
    } else {
      console.log(`📊 Catálogo ya tiene ${row.count} productos`);
    }
  });
};

// Crear las tablas si no existen (en serie)
db.serialize(() => {
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
      // Insertar motos DESPUÉS de crear la tabla
      insertMotosIfEmpty();
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
});

module.exports = db;