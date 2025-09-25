import { Link } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../api/auth';

const Home = () => {
  const authenticated = isAuthenticated();
  const user = getCurrentUser();

  return (
    <div className="container">
      <div className="home-hero">
        <h1 className="hero-title">
          Bienvenido a VehículosMax
        </h1>
        <p className="hero-subtitle">
          {authenticated 
            ? `¡Hola ${user?.name}! Encuentra el vehículo perfecto para ti` 
            : 'El mejor lugar para comprar y vender vehículos'
          }
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
          <Link to="/catalog" className="hero-cta">
            Ver Catálogo
          </Link>
          
          {!authenticated && (
            <Link to="/register" className="hero-cta">
              Registrarse
            </Link>
          )}
        </div>
      </div>

      {/* Características principales */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '2rem', 
        marginTop: '4rem' 
      }}>
        <div className="feature-card" style={{ 
          background: 'rgba(255, 255, 255, 0.95)', 
          backdropFilter: 'blur(10px)', 
          padding: '2rem', 
          borderRadius: '15px', 
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚗</div>
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>Amplio Catálogo</h3>
          <p style={{ color: '#666', lineHeight: '1.6' }}>
            Miles de vehículos nuevos y usados. Encuentra desde motos hasta camiones.
          </p>
        </div>

        <div className="feature-card" style={{ 
          background: 'rgba(255, 255, 255, 0.95)', 
          backdropFilter: 'blur(10px)', 
          padding: '2rem', 
          borderRadius: '15px', 
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>Mejores Precios</h3>
          <p style={{ color: '#666', lineHeight: '1.6' }}>
            Precios competitivos y planes de financiamiento flexibles.
          </p>
        </div>

        <div className="feature-card" style={{ 
          background: 'rgba(255, 255, 255, 0.95)', 
          backdropFilter: 'blur(10px)', 
          padding: '2rem', 
          borderRadius: '15px', 
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>Garantía Total</h3>
          <p style={{ color: '#666', lineHeight: '1.6' }}>
            Todos nuestros vehículos tienen garantía y soporte post-venta.
          </p>
        </div>
      </div>

      {/* Estadísticas */}
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.1)', 
        backdropFilter: 'blur(10px)', 
        borderRadius: '15px', 
        padding: '3rem', 
        marginTop: '4rem', 
        textAlign: 'center' 
      }}>
        <h2 style={{ color: 'black', marginBottom: '2rem', fontSize: '2rem' }}>
          ¿Por qué elegir VehículosMax?
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '2rem',
          color: 'black'
        }}>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>2+</div>
            <div style={{ opacity: 0.8 }}>Vehículos Vendidos</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>98%</div>
            <div style={{ opacity: 0.8 }}>Clientes Satisfechos</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>4⭐</div>
            <div style={{ opacity: 0.8 }}>Calificación Promedio</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>24/6</div>
            <div style={{ opacity: 0.8 }}>Soporte al Cliente</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;