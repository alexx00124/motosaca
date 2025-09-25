import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

const Login = () => {
  const [formData, setFormData] = useState({
    name: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar error cuando usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(formData);
      
      if (response.success) {
        // Redirigir al catálogo después del login exitoso
        navigate('/catalog');
      } else {
        setError(response.message || 'Error en el login');
      }
    } catch (err) {
      setError(err.message || 'Error de conexión. Verifica que el servidor esté funcionando.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="form-title">🔑 Iniciar Sesión</h2>
        
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre de Usuario</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ingresa tu nombre de usuario"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Ingresa tu contraseña"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
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
                Iniciando sesión...
              </>
            ) : (
              '🚗 Iniciar Sesión'
            )}
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '1.5rem', 
          padding: '1rem', 
          background: 'rgba(0, 0, 0, 0.05)', 
          borderRadius: '10px' 
        }}>
          <p style={{ color: '#666', marginBottom: '0.5rem' }}>
            ¿No tienes una cuenta?
          </p>
          <Link 
            to="/register" 
            style={{ 
              color: '#667eea', 
              textDecoration: 'none', 
              fontWeight: '600' 
            }}
          >
            👤 Registrarse aquí
          </Link>
        </div>

        {/* Datos de prueba */}
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          background: 'rgba(102, 126, 234, 0.1)', 
          borderRadius: '10px',
          fontSize: '0.9rem',
          color: '#555'
        }}>
          <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
            💡 Datos de prueba:
          </p>
          <p>Usuario: testuser | Contraseña: password123</p>
          <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.5rem' }}>
            O crea una cuenta nueva con el botón de registro
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;