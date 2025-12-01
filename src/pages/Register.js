import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    rut: "",
    phone: "",
    birthDate: "",
  });

  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMsg(null);
    setLoading(true);

    try {
      const payload = {
        ...form,
        birthDate: form.birthDate, // formato YYYY-MM-DD (input date)
      };
      await api.post("/api/auth/register", payload);
      setMsg("Registro exitoso, ahora puedes iniciar sesión.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const apiMsg =
        err.response?.data?.message ||
        err.response?.data ||
        "Error al registrarse";
      setError(apiMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-7 col-lg-6">
        <div className="card-urban">
          <h2 className="page-title mb-3">Registro</h2>
          <p className="text-muted-soft">
            Completa tus datos para crear tu cuenta en BarzArena.
          </p>

          {error && (
            <div className="alert alert-danger py-2">
              {error}
            </div>
          )}

          {msg && (
            <div className="alert alert-success py-2">
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-3 row g-3">
            <div className="col-md-6">
              <label className="form-label">Usuario</label>
              <input
                type="text"
                name="username"
                className="form-control"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Correo</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">RUT (sin puntos ni guión)</label>
              <input
                type="text"
                name="rut"
                className="form-control"
                value={form.rut}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Teléfono</label>
              <input
                type="text"
                name="phone"
                className="form-control"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Fecha de nacimiento</label>
              <input
                type="date"
                name="birthDate"
                className="form-control"
                value={form.birthDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12">
              <button className="btn btn-accent w-100" disabled={loading}>
                {loading ? "Registrando..." : "Registrarme"}
              </button>
            </div>
          </form>

          <p className="mt-3 text-muted-soft">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-decoration-underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
