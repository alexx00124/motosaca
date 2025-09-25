import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, isAuthenticated } from '../api/auth';
import { createSale } from '../api/sales';

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const user = getCurrentUser();
  const authenticated = isAuthenticated();

  useEffect(() => {
    // Verificar autenticación
    if (!authenticated) {
      navigate('/login');
      return;
    }
    
    loadCartFromStorage();
  }, [authenticated, navigate]);

  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const saveCartToStorage = (newCart) => {
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.id !== productId);
    setCart(newCart);
    saveCartToStorage(newCart);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const newCart = cart.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    );
    setCart(newCart);
    saveCartToStorage(newCart);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError('Tu carrito está vacío');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Usuario actual:', user);
      console.log('Carrito actual:', cart);

      // Verificar que el usuario tenga user_id
      if (!user || !user.user_id) {
        setError('Error: Usuario no válido. Intenta cerrar sesión e iniciar sesión nuevamente.');
        setLoading(false);
        return;
      }

      // Preparar datos para la venta
      const saleData = {
        user_id: user.user_id,
        products: cart.map(item => ({
          id: item.id,
          quantity: item.quantity
        }))
      };

      console.log('Datos a enviar:', saleData);

      const response = await createSale(saleData);
      console.log('Respuesta recibida:', response);

      if (response.success) {
        setSuccess(`¡Compra realizada exitosamente! 🎉\nTotal: ${formatPrice(response.data.total_price)}\nID de venta: ${response.data.sale_id}`);
        clearCart();
        
        // Redirigir después de 5 segundos
        setTimeout(() => {
          navigate('/catalog');
        }, 5000);
      } else {
        setError(response.message || 'Error al procesar la compra');
      }
    } catch (err) {
      console.error('Error completo:', err);
      setError(err.message || 'Error de conexión. Verifica que el servidor backend esté funcionando en http://localhost:3000');
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return null; // El useEffect ya redirige
  }

  return (
    <div className="container">
      <div className="checkout-container">
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '2rem',
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '2.5rem'
        }}>
          🛒 Mi Carrito
        </h1>

        {/* Información del usuario */}
        <div style={{
          background: 'rgba(102, 126, 234, 0.1)',
          padding: '1rem',
          borderRadius: '10px',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, color: '#667eea', fontWeight: '600' }}>
            👋 Comprando como: {user?.name}
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '2rem' }}>
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" style={{ marginBottom: '2rem' }}>
            <div style={{ whiteSpace: 'pre-line' }}>{success}</div>
            <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
              Redirigiendo al catálogo en 5 segundos...
            </div>
          </div>
        )}

        {cart.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            background: 'rgba(0, 0, 0, 0.05)',
            borderRadius: '15px'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
            <h3 style={{ marginBottom: '1rem', color: '#666' }}>Tu carrito está vacío</h3>
            <p style={{ color: '#999', marginBottom: '2rem' }}>
              Agrega algunos vehículos desde el catálogo
            </p>
            <button
              onClick={() => navigate('/catalog')}
              className="btn-primary"
              style={{ maxWidth: '300px' }}
            >
              🏪 Ir al Catálogo
            </button>
          </div>
        ) : (
          <>
            {/* Lista de productos en el carrito */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: '#333' }}>
                Productos en tu carrito ({cart.length})
              </h3>
              
              {cart.map((item) => (
                <div key={item.id} className="cart-item" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.5rem',
                  background: 'rgba(0, 0, 0, 0.02)',
                  borderRadius: '10px',
                  marginBottom: '1rem',
                  border: '1px solid rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ flex: '1' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                      {item.name}
                    </h4>
                    <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                      {formatPrice(item.price)} c/u
                    </p>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem',
                    minWidth: '200px',
                    justifyContent: 'flex-end'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{
                          background: '#ff6b6b',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          cursor: 'pointer',
                          fontSize: '1.2rem'
                        }}
                      >
                        -
                      </button>
                      
                      <span style={{ 
                        fontWeight: 'bold', 
                        minWidth: '30px', 
                        textAlign: 'center',
                        fontSize: '1.1rem'
                      }}>
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{
                          background: '#51cf66',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          cursor: 'pointer',
                          fontSize: '1.2rem'
                        }}
                      >
                        +
                      </button>
                    </div>
                    
                    <div style={{ 
                      fontWeight: 'bold', 
                      color: '#667eea',
                      minWidth: '100px',
                      textAlign: 'right'
                    }}>
                      {formatPrice(item.price * item.quantity)}
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        background: 'transparent',
                        border: '1px solid #ff6b6b',
                        color: '#ff6b6b',
                        borderRadius: '5px',
                        padding: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '1rem'
                      }}
                      title="Eliminar del carrito"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen y total */}
            <div style={{
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              color: 'white',
              padding: '2rem',
              borderRadius: '15px',
              marginBottom: '2rem'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>Total a pagar:</h3>
                  <p style={{ margin: 0, opacity: 0.9 }}>
                    {cart.reduce((total, item) => total + item.quantity, 0)} vehículo
                    {cart.reduce((total, item) => total + item.quantity, 0) !== 1 ? 's' : ''}
                  </p>
                </div>
                
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold',
                  textAlign: 'right'
                }}>
                  {formatPrice(calculateTotal())}
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => navigate('/catalog')}
                style={{
                  padding: '1rem 2rem',
                  background: 'rgba(102, 126, 234, 0.1)',
                  border: '2px solid #667eea',
                  color: '#667eea',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}
              >
                🏪 Seguir Comprando
              </button>

              <button
                onClick={clearCart}
                style={{
                  padding: '1rem 2rem',
                  background: 'rgba(255, 107, 107, 0.1)',
                  border: '2px solid #ff6b6b',
                  color: '#ff6b6b',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}
              >
                🗑️ Vaciar Carrito
              </button>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="btn-primary"
                style={{ 
                  minWidth: '200px',
                  fontSize: '1.1rem'
                }}
              >
                {loading ? (
                  <>
                    <span style={{ 
                      display: 'inline-block', 
                      animation: 'spin 1s linear infinite',
                      marginRight: '8px'
                    }}>
                      ⏳
                    </span>
                    Procesando...
                  </>
                ) : (
                  '💳 Finalizar Compra'
                )}
              </button>
            </div>

            {/* Información adicional */}
            <div style={{
              marginTop: '2rem',
              padding: '1rem',
              background: 'rgba(0, 0, 0, 0.05)',
              borderRadius: '10px',
              fontSize: '0.9rem',
              color: '#666'
            }}>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>
                💡 Información importante:
              </p>
              <ul style={{ marginLeft: '1rem', lineHeight: '1.5' }}>
                <li>La compra se registrará en tu historial</li>
                <li>Recibirás una confirmación por email</li>
                <li>Nuestro equipo se contactará contigo para coordinar la entrega</li>
                <li>Garantía incluida en todos los vehículos</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;