import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar mensajes cuando usuario empiece a escribir
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validación de contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    // Validación de longitud de contraseña
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    // Validación de nombre de usuario
    if (formData.name.length < 3) {
      setError('El nombre de usuario debe tener al menos 3 caracteres');
      setLoading(false);
      return;
    }

    try {
      const response = await register({
        name: formData.name,
        password: formData.password
      });
      
      if (response.success) {
        setSuccess('¡Cuenta creada exitosamente! Redirigiendo al login...');
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.message || 'Error al crear la cuenta');
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
        <h2 className="form-title">👤 Crear Cuenta</h2>
        
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
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
              placeholder="Elige un nombre de usuario"
              autoComplete="username"
              minLength={3}
              maxLength={50}
            />
            <small style={{ color: '#666', fontSize: '0.8rem' }}>
              Mínimo 3 caracteres, máximo 50
            </small>
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
              placeholder="Crea una contraseña segura"
              autoComplete="new-password"
              minLength={6}
            />
            <small style={{ color: '#666', fontSize: '0.8rem' }}>
              Mínimo 6 caracteres
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Repite tu contraseña"
              autoComplete="new-password"
              minLength={6}
            />
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <small style={{ color: '#ff6b6b', fontSize: '0.8rem' }}>
                Las contraseñas no coinciden
              </small>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading || formData.password !== formData.confirmPassword}
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
                Creando cuenta...
              </>
            ) : (
              '🚗 Crear Cuenta'
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
            ¿Ya tienes una cuenta?
          </p>
          <Link 
            to="/login" 
            style={{ 
              color: '#667eea', 
              textDecoration: 'none', 
              fontWeight: '600' 
            }}
          >
            🔑 Iniciar Sesión
          </Link>
        </div>

        {/* Información de seguridad */}
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          background: 'rgba(81, 207, 102, 0.1)', 
          borderRadius: '10px',
          fontSize: '0.9rem',
          color: '#555'
        }}>
          <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
            🔒 Tu información está segura:
          </p>
          <ul style={{ marginLeft: '1rem', lineHeight: '1.5' }}>
            <li>Las contraseñas se encriptan con bcrypt</li>
            <li>No compartimos tus datos personales</li>
            <li>Conexión segura SSL</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Register;