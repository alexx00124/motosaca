// src/components/PrivateRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../api/auth';

export default function PrivateRoute({ children }) {
  const authed = isAuthenticated();         // true/false inmediato
  const location = useLocation();

  // Si NO está autenticado, ve a /login (no a "/")
  return authed
    ? children
    : <Navigate to="/login" replace state={{ from: location }} />;
}

//hola puto