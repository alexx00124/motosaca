const Footer = () => {
  return (
    <footer className="footer">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ marginBottom: '0.5rem' }}>🚗 VehículosMax</h3>
            <p style={{ opacity: 0.8 }}>Tu concesionario de confianza desde 2024</p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <p style={{ marginBottom: '0.5rem' }}>📞 Contacto</p>
            <p style={{ opacity: 0.8 }}>+57 300 123 4567</p>
            <p style={{ opacity: 0.8 }}>info@vehiculosmax.com</p>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <p style={{ marginBottom: '0.5rem' }}>📍 Ubicación</p>
            <p style={{ opacity: 0.8 }}>Bogotá, Colombia</p>
            <p style={{ opacity: 0.8 }}>Carrera 15 #93-07</p>
          </div>
        </div>
        
        <hr style={{ margin: '2rem 0', opacity: 0.3 }} />
        
        <div style={{ textAlign: 'center', opacity: 0.7 }}>
          <p>&copy; 2024 VehículosMax. Todos los derechos reservados.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Desarrollado con ❤️ por el equipo de VehículosMax
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;