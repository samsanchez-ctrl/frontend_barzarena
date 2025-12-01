import React, { useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { auth, refreshUser } = useAuth();
  const [addAmount, setAddAmount] = useState("");
  const [spendAmount, setSpendAmount] = useState("");
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(null);
    setMsg(null);
    try {
      await api.post("/api/users/add-balance", {
        amount: parseFloat(addAmount),
      });
      setMsg("Saldo agregado correctamente.");
      setAddAmount("");
      await refreshUser();
    } catch (err) {
      const apiMsg =
        err.response?.data?.message || "No se pudo agregar saldo.";
      setError(apiMsg);
    }
  };

  const handleSpend = async (e) => {
    e.preventDefault();
    setError(null);
    setMsg(null);
    try {
      await api.post("/api/users/spend", {
        amount: parseFloat(spendAmount),
      });
      setMsg("Saldo gastado manualmente.");
      setSpendAmount("");
      await refreshUser();
    } catch (err) {
      const apiMsg =
        err.response?.data?.message || "No se pudo gastar saldo.";
      setError(apiMsg);
    }
  };

  return (
    <div className="row g-4">
      <div className="col-md-5">
        <div className="card-urban">
          <h2 className="page-title mb-3">Perfil</h2>
          <p className="text-muted-soft mb-2">
            Usuario: <strong>{auth.username}</strong>
          </p>
          <p className="text-muted-soft mb-2">
            Saldo actual: <strong>${auth.saldo?.toFixed(0)}</strong>
          </p>
        </div>
      </div>

      <div className="col-md-7">
        <div className="card-urban">
          <h4 className="mb-3">Gestión de saldo</h4>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          {msg && <div className="alert alert-success py-2">{msg}</div>}

          <div className="row g-3">
            <div className="col-md-6">
              <form onSubmit={handleAdd}>
                <label className="form-label">Agregar saldo</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  className="form-control mb-2"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                />
                <button className="btn btn-accent w-100" type="submit">
                  Agregar
                </button>
              </form>
            </div>
            <div className="col-md-6">
              <form onSubmit={handleSpend}>
                <label className="form-label">Gastar saldo</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  className="form-control mb-2"
                  value={spendAmount}
                  onChange={(e) => setSpendAmount(e.target.value)}
                />
                <button className="btn btn-accent w-100" type="submit">
                  Gastar
                </button>
              </form>
            </div>
          </div>

          <p className="text-muted-soft mt-3 small">
            ¡ Estas compras son totalmente simuladas, disfruta !
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
