import React, { useEffect, useState } from "react";
import api from "../../api";

const emptyForm = {
  id: null,
  name: "",
  realName: "",
  bio: "",
  origin: "",
  imageUrl: "",
  active: true,
};

const AdminRappers = () => {
  const [rappers, setRappers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);

  const loadRappers = async () => {
    setError(null);
    try {
      const res = await api.get("/api/rappers/admin/all");
      setRappers(res.data);
    } catch (e) {
      setError("No se pudieron cargar los raperos.");
    }
  };

  useEffect(() => {
    loadRappers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (r) => {
    setForm({
      id: r.id,
      name: r.name,
      realName: r.realName,
      bio: r.bio,
      origin: r.origin,
      imageUrl: r.imageUrl,
      active: r.active,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar rapero?")) return;
    setError(null);
    setMsg(null);
    try {
      await api.delete(`/api/rappers/${id}`);
      setMsg("Rapper eliminado.");
      loadRappers();
    } catch (e) {
      setError("No se pudo eliminar el rapero.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMsg(null);
    try {
      const payload = {
        name: form.name,
        realName: form.realName,
        bio: form.bio,
        origin: form.origin,
        imageUrl: form.imageUrl,
        active: form.active,
      };
      if (form.id) {
        await api.put(`/api/rappers/${form.id}`, payload);
        setMsg("Rapper actualizado.");
      } else {
        await api.post("/api/rappers", payload);
        setMsg("Rapper creado.");
      }
      setForm(emptyForm);
      loadRappers();
    } catch (err) {
      const apiMsg =
        err.response?.data?.message || "No se pudo guardar el rapero.";
      setError(apiMsg);
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
  };

  return (
    <div className="row g-3">
      <div className="col-md-7">
        <h2 className="page-title mb-3">Admin Raperos</h2>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        {msg && <div className="alert alert-success py-2">{msg}</div>}

        <table className="table table-dark-urban align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre artístico</th>
              <th>Origen</th>
              <th>Activo</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rappers.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.name}</td>
                <td>{r.origin}</td>
                <td>{r.active ? "Sí" : "No"}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-accent me-2"
                    onClick={() => handleEdit(r)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(r.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {rappers.length === 0 && (
              <tr>
                <td colSpan="5" className="text-muted-soft">
                  No hay raperos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="col-md-5">
        <div className="card-urban">
          <h4 className="mb-3">
            {form.id ? "Editar rapero" : "Nuevo rapero"}
          </h4>
          <form onSubmit={handleSubmit} className="row g-2">
            <div className="col-12">
              <label className="form-label">Nombre artístico</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label">Nombre real</label>
              <input
                type="text"
                name="realName"
                className="form-control"
                value={form.realName}
                onChange={handleChange}
              />
            </div>
            <div className="col-12">
              <label className="form-label">Origen</label>
              <input
                type="text"
                name="origin"
                className="form-control"
                value={form.origin}
                onChange={handleChange}
              />
            </div>
            <div className="col-12">
              <label className="form-label">Bio</label>
              <textarea
                name="bio"
                className="form-control"
                rows="2"
                value={form.bio}
                onChange={handleChange}
              />
            </div>
            <div className="col-12">
              <label className="form-label">URL imagen</label>
              <input
                type="text"
                name="imageUrl"
                className="form-control"
                value={form.imageUrl}
                onChange={handleChange}
              />
            </div>
            <div className="col-12 form-check mt-2">
              <input
                type="checkbox"
                id="active"
                name="active"
                className="form-check-input"
                checked={form.active}
                onChange={handleChange}
              />
              <label htmlFor="active" className="form-check-label">
                Activo
              </label>
            </div>
            <div className="col-12 d-flex justify-content-between mt-2">
              <button className="btn btn-accent" type="submit">
                {form.id ? "Actualizar" : "Crear"}
              </button>
              {form.id && (
                <button
                  type="button"
                  className="btn btn-outline-accent"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminRappers;
