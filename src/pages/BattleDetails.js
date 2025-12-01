import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const BattleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, auth, refreshUser } = useAuth();

  const [battle, setBattle] = useState(null);
  const [amount, setAmount] = useState("");
  const [prediction, setPrediction] = useState("A");
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  const loadBattle = async () => {
    try {
      const res = await api.get(`/api/battles/${id}`);
      setBattle(res.data);
    } catch (e) {
      console.error(e);
      setError("No se pudo cargar la batalla.");
    }
  };

  useEffect(() => {
    loadBattle();
    // eslint-disable-next-line
  }, [id]);

  const handlePlaceBet = async (e) => {
    e.preventDefault();
    setError(null);
    setMsg(null);

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      const payload = {
        battleId: Number(id),
        prediction,
        amount: parseFloat(amount),
      };
      await api.post("/api/bets/place", payload);
      setMsg("Apuesta registrada correctamente.");
      await refreshUser();
    } catch (err) {
      const apiMsg =
        err.response?.data?.message ||
        err.response?.data ||
        "Error al registrar la apuesta";
      setError(apiMsg);
    }
  };

  if (!battle) {
    return (
      <div>
        <h2 className="page-title mb-3">Detalle batalla</h2>
        {error ? <p className="text-danger">{error}</p> : <p>Cargando...</p>}
      </div>
    );
  }

  return (
    <div className="row g-4">
      <div className="col-md-7">
        <div className="card-urban">
          <h2 className="page-title mb-3">Batalla #{battle.id}</h2>
          <p className="text-muted-soft">
            {battle.rapperA?.name} vs {battle.rapperB?.name}
          </p>

          <p className="text-muted-soft">
            Fecha: <strong>{new Date(battle.date).toLocaleString()}</strong>
          </p>

          <p className="text-muted-soft">
            Estado:{" "}
            <strong>
              {battle.winner === "NONE" || !battle.winner
                ? "Sin ganador todavía"
                : `Ganador: ${battle.winner}`}
            </strong>
          </p>

          {!battle.active && (
            <div className="alert alert-warning mt-3 py-2">
              Esta batalla no está activa para apuestas.
            </div>
          )}
        </div>
      </div>

      <div className="col-md-5">
        <div className="card-urban">
          <h4 className="mb-3">Apostar en esta batalla</h4>

          {!isLoggedIn && (
            <p className="text-muted-soft">
              Debes iniciar sesión para apostar.
            </p>
          )}

          {error && (
            <div className="alert alert-danger py-2">{error}</div>
          )}
          {msg && (
            <div className="alert alert-success py-2">{msg}</div>
          )}

          <form onSubmit={handlePlaceBet}>
            <div className="mb-3">
              <label className="form-label">Tu predicción</label>
              <select
                className="form-select"
                value={prediction}
                onChange={(e) => setPrediction(e.target.value)}
                disabled={!isLoggedIn || !battle.active}
              >
                <option value="A">{battle.rapperA?.name}</option>
                <option value="B">{battle.rapperB?.name}</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Monto a apostar (Saldo actual: ${auth.saldo?.toFixed(0)})
              </label>
              <input
                type="number"
                className="form-control"
                min="1"
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={!isLoggedIn || !battle.active}
                required
              />
            </div>

            <button
              className="btn btn-accent w-100"
              type="submit"
              disabled={!isLoggedIn || !battle.active}
            >
              Aceptar apuesta
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BattleDetails;
