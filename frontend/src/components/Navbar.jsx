import { Link, useLocation } from "react-router-dom";
import { isAuthenticated, getCurrentUser, logout } from "../api/auth";

const Navbar = () => {
  const location = useLocation();
  const authenticated = isAuthenticated();
  const user = getCurrentUser();

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de que quieres cerrar sesión?")) {
      logout();
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          VehículosMax
        </Link>

        <div className="navbar-links">
          <Link to="/" className={isActive("/") ? "active" : ""}>
            Inicio
          </Link>

          <Link to="/catalog" className={isActive("/catalog") ? "active" : ""}>
            Catálogo
          </Link>

          {authenticated ? (
            <>
              <Link
                to="/checkout"
                className={isActive("/checkout") ? "active" : ""}
              >
                Carrito
              </Link>

              <span style={{ color: " #96232dff", fontWeight: "bold" }}>
                Hola, {user?.name}
              </span>

              <button onClick={handleLogout} className="logout-btn">
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={isActive("/login") ? "active" : ""}>
                Iniciar Sesión
              </Link>

              <Link
                to="/register"
                className={isActive("/register") ? "active" : ""}
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
