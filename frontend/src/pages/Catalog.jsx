import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { getCatalog } from '../api/catalog';
import { isAuthenticated } from '../api/auth';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState([]);

  const authenticated = isAuthenticated();

  useEffect(() => {
    loadProducts();
    loadCartFromStorage();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await getCatalog();
      
      if (response.success) {
        setProducts(response.data || []);
      } else {
        setError('Error al cargar los productos');
      }
    } catch (err) {
      setError('Error de conexión. Verifica que el servidor esté funcionando.');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const saveCartToStorage = (newCart) => {
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const handleAddToCart = (product) => {
    if (!authenticated) {
      alert('Debes iniciar sesión para agregar productos al carrito');
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    let newCart;

    if (existingItem) {
      newCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(newCart);
    saveCartToStorage(newCart);

    const itemName = product.name.length > 20 
      ? product.name.substring(0, 20) + '...' 
      : product.name;
    
    alert(`✅ "${itemName}" agregado al carrito`);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔄</div>
          Cargando catálogo de vehículos...
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header del catálogo */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          color: 'Black', 
          marginBottom: '1rem',
          textShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}>
          Catálogo de Vehículos
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          color: 'rgba(255,255,255,0.9)',
          marginBottom: '2rem'
        }}>
          Encuentra el vehículo perfecto para ti
        </p>

        {/* Información del carrito */}
        {authenticated && cart.length > 0 && (
          <div style={{
            background: 'rgba(81, 207, 102, 0.2)',
            backdropFilter: 'blur(10px)',
            padding: '1rem',
            borderRadius: '15px',
            color: 'white',
            display: 'inline-block'
          }}>
            🛒 Tienes {cart.length} producto{cart.length !== 1 ? 's' : ''} en tu carrito
          </div>
        )}
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '2rem' }}>
          {error}
          <button 
            onClick={loadProducts}
            style={{ 
              marginLeft: '1rem', 
              background: 'none', 
              border: '1px solid #721c24', 
              color: '#721c24', 
              padding: '0.5rem 1rem', 
              borderRadius: '5px', 
              cursor: 'pointer' 
            }}
          >
            🔄 Reintentar
          </button>
        </div>
      )}

      {/* Grid de productos */}
      {products.length > 0 ? (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      ) : !loading && !error && (
        <div style={{ 
          textAlign: 'center', 
          color: 'white', 
          padding: '3rem',
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '15px'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛻</div>
          <h3 style={{ marginBottom: '1rem' }}>No hay vehículos disponibles</h3>
          <p style={{ opacity: 0.8 }}>
            El catálogo está vacío en este momento
          </p>
        </div>
      )}

      {/* Mensaje para usuarios no autenticados */}
      {!authenticated && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          padding: '2rem',
          borderRadius: '15px',
          textAlign: 'center',
          color: 'black',
          marginTop: '2rem'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>¿Quieres comprar?</h3>
          <p style={{ marginBottom: '1rem', opacity: 0.9 }}>
            Inicia sesión para agregar vehículos a tu carrito
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href="/login" className="hero-cta">
              Iniciar Sesión
            </a>
            <a href="/register" className="hero-cta">
              Registrarse
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalog;
