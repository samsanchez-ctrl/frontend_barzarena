import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { auth, isLoggedIn, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-urban">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          BARZ<span style={{ color: "#f97316" }}>ARENA</span>
        </Link>

        <button
          className="navbar-toggler text-light"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/battles">
                Batallas
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/rappers">
                Raperos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/products">
                Tienda
              </NavLink>
            </li>

            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/cart">
                    Carrito
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/my-bets">
                    Mis Apuestas
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/my-purchases">
                    Mis Compras
                  </NavLink>
                </li>
                {/* NUEVO: enlace visible a perfil/saldo */}
                <li className="nav-item">
                  <NavLink className="nav-link" to="/profile">
                    Perfil / Saldo
                  </NavLink>
                </li>
              </>
            )}

            {isAdmin && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin">
                  Admin
                </NavLink>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {isLoggedIn && (
              <button
                type="button"
                onClick={goToProfile}
                className="chip border-0 bg-transparent p-0"
                style={{ cursor: "pointer" }}
                title="Ir a Perfil / Saldo"
              >
                <span className="me-2">💳 Saldo:</span>
                <span className="fw-bold text-light">
                  ${auth.saldo?.toFixed(0)}
                </span>
              </button>
            )}

            {!isLoggedIn ? (
              <>
                <Link to="/login" className="btn btn-accent btn-sm">
                  Iniciar sesión
                </Link>
                <Link to="/register" className="btn btn-accent btn-sm">
                  Registrarme
                </Link>
              </>
            ) : (
              <>
                <span className="text-muted-soft d-none d-md-inline">
                  {auth.username?.toUpperCase()}
                </span>
                <button className="btn btn-outline-accent btn-sm" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
