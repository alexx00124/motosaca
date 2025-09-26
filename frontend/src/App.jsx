import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute'; // ✅ CORRECTO - no ProductCard

// Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalog from './pages/Catalog';
import Checkout from './pages/Checkout';

function App() {
  console.log('App rendering, current path:', window.location.pathname);
  
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <main style={{ flex: 1 }}>
        {console.log('Rendering routes for path:', window.location.pathname)}
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/catalog" element={<Catalog />} />
          
          {/* Rutas protegidas - SIN el asterisco */}
          <Route 
            path="/checkout" 
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            } 
          />
          
          {/* Ruta 404 */}
          <Route 
            path="*" 
            element={
              <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  padding: '3rem',
                  borderRadius: '20px',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                  maxWidth: '500px',
                  margin: '0 auto'
                }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚧</div>
                  <h2 style={{ 
                    marginBottom: '1rem',
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    Página no encontrada
                  </h2>
                  <p style={{ color: '#666', marginBottom: '2rem' }}>
                    La página que buscas no existe o ha sido movida.
                  </p>
                  <button
                    onClick={() => window.location.href = '/'}
                    className="btn-primary"
                    style={{ maxWidth: '200px' }}
                  >
                    🏠 Ir al Inicio
                  </button>
                </div>
              </div>
            } 
          />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;