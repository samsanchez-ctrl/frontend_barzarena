import React, { useEffect, useState } from "react";
import api from "../../api";

const emptyForm = {
  id: null,
  rapperAId: "",
  rapperBId: "",
  date: "",
  active: true,
};

const AdminBattles = () => {
  const [battles, setBattles] = useState([]);
  const [rappers, setRappers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [winnerId, setWinnerId] = useState(null);
  const [winner, setWinner] = useState("A");
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);

  const loadData = async () => {
    setError(null);
    try {
      const [bRes, rRes] = await Promise.all([
        api.get("/api/battles/admin/all"),
        api.get("/api/rappers"),
      ]);
      setBattles(bRes.data);
      setRappers(rRes.data);
    } catch (e) {
      setError("No se pudieron cargar batallas o raperos.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (b) => {
    setForm({
      id: b.id,
      rapperAId: b.rapperA?.id,
      rapperBId: b.rapperB?.id,
      date: b.date.slice(0, 16), // "YYYY-MM-DDTHH:mm"
      active: b.active,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar batalla?")) return;
    setError(null);
    setMsg(null);
    try {
      await api.delete(`/api/battles/${id}`);
      setMsg("Batalla eliminada.");
      loadData();
    } catch (e) {
      setError("No se pudo eliminar la batalla.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMsg(null);
    try {
      const payload = {
        rapperAId: Number(form.rapperAId),
        rapperBId: Number(form.rapperBId),
        date: form.date,
        active: form.active,
      };
      if (form.id) {
        await api.put(`/api/battles/${form.id}`, payload);
        setMsg("Batalla actualizada.");
      } else {
        await api.post("/api/battles", payload);
        setMsg("Batalla creada.");
      }
      setForm(emptyForm);
      loadData();
    } catch (err) {
      const apiMsg =
        err.response?.data?.message || "No se pudo guardar la batalla.";
      setError(apiMsg);
    }
  };

  const handleSetWinner = async () => {
    if (!winnerId) return;
    setError(null);
    setMsg(null);
    try {
      await api.post(`/api/battles/${winnerId}/winner`, null, {
        params: { winner },
      });
      setMsg("Ganador asignado y apuestas procesadas.");
      setWinnerId(null);
      loadData();
    } catch (err) {
      const apiMsg =
        err.response?.data?.message || "No se pudo asignar ganador.";
      setError(apiMsg);
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
  };

  return (
    <div className="row g-3">
      <div className="col-md-8">
        <h2 className="page-title mb-3">Admin Batallas</h2>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        {msg && <div className="alert alert-success py-2">{msg}</div>}

        <table className="table table-dark-urban align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Batalla</th>
              <th>Fecha</th>
              <th>Ganador</th>
              <th>Activa</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {battles.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>
                  {b.rapperA?.name} vs {b.rapperB?.name}
                </td>
                <td>{new Date(b.date).toLocaleString()}</td>
                <td>{b.winner === "NONE" || !b.winner ? "-" : b.winner}</td>
                <td>{b.active ? "Sí" : "No"}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-accent me-2"
                    onClick={() => handleEdit(b)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger me-2"
                    onClick={() => handleDelete(b.id)}
                  >
                    Eliminar
                  </button>
                  <button
                    className="btn btn-sm btn-outline-accent"
                    onClick={() => setWinnerId(b.id)}
                  >
                    Ganador
                  </button>
                </td>
              </tr>
            ))}
            {battles.length === 0 && (
              <tr>
                <td colSpan="6" className="text-muted-soft">
                  No hay batallas configuradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {winnerId && (
          <div className="card-urban mt-3">
            <h5>Asignar ganador a batalla #{winnerId}</h5>
            <div className="d-flex align-items-center gap-2 mt-2">
              <select
                className="form-select"
                style={{ maxWidth: "150px" }}
                value={winner}
                onChange={(e) => setWinner(e.target.value)}
              >
                <option value="A">Ganador: A</option>
                <option value="B">Ganador: B</option>
              </select>
              <button className="btn btn-accent btn-sm" onClick={handleSetWinner}>
                Confirmar
              </button>
              <button
                className="btn btn-outline-accent btn-sm"
                onClick={() => setWinnerId(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="col-md-4">
        <div className="card-urban">
          <h4 className="mb-3">
            {form.id ? "Editar batalla" : "Nueva batalla"}
          </h4>
          <form onSubmit={handleSubmit} className="row g-2">
            <div className="col-12">
              <label className="form-label">Rapper A</label>
              <select
                name="rapperAId"
                className="form-select"
                value={form.rapperAId}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona</option>
                {rappers.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12">
              <label className="form-label">Rapper B</label>
              <select
                name="rapperBId"
                className="form-select"
                value={form.rapperBId}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona</option>
                {rappers.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12">
              <label className="form-label">Fecha y hora</label>
              <input
                type="datetime-local"
                name="date"
                className="form-control"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-12 form-check mt-2">
              <input
                type="checkbox"
                id="activeBattle"
                name="active"
                className="form-check-input"
                checked={form.active}
                onChange={handleChange}
              />
              <label htmlFor="activeBattle" className="form-check-label">
                Activa
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

export default AdminBattles;
