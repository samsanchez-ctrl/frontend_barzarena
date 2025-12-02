import React, { useEffect, useState } from "react";
import api from "../api";

const MyBets = () => {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  const loadBets = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/bets/me");
      setBets(res.data || []);
    } catch (e) {
      console.error(e);
      setError("No se pudieron cargar tus apuestas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBets();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  };

  const handleCancelBet = async (betId) => {
    const ok = window.confirm(
      "¿Seguro que deseas cancelar esta apuesta?\nSi la batalla todavía no tiene ganador, se te devolverá el saldo."
    );
    if (!ok) return;

    setMsg(null);
    setError(null);

    try {
      await api.delete(`/api/bets/${betId}`);
      setMsg("Apuesta cancelada correctamente. El saldo ha sido reembolsado.");
      // la quitamos del listado sin recargar toda la página
      setBets((prev) => prev.filter((b) => b.id !== betId));
    } catch (err) {
      console.error(err);
      const apiMsg =
        err.response?.data?.message ||
        "No se pudo cancelar la apuesta. Verifica que la batalla no tenga ganador.";
      setError(apiMsg);
    }
  };

  return (
    <div>
      <h2 className="page-title mb-3">Mis Apuestas</h2>
      <p className="text-muted-soft mb-3">
        Aquí puedes ver el historial de tus apuestas en batallas de rap y cancelar
        aquellas que aún no tienen ganador asignado.
      </p>

      {loading && <p className="text-muted-soft">Cargando apuestas...</p>}

      {error && (
        <div className="alert alert-danger py-2" role="alert">
          {error}
        </div>
      )}

      {msg && (
        <div className="alert alert-success py-2" role="alert">
          {msg}
        </div>
      )}

      {!loading && bets.length === 0 && (
        <p className="text-muted-soft">Aún no has realizado apuestas.</p>
      )}

      {!loading && bets.length > 0 && (
        <div className="card-urban">
          <div className="table-responsive">
            <table className="table table-dark table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Batalla</th>
                  <th>Fecha batalla</th>
                  <th>Predicción</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th style={{ width: "160px" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {bets.map((b) => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>Batalla #{b.battleId}</td>
                    <td>{formatDate(b.battleDate)}</td>
                    <td>
                      {b.prediction === "A"
                        ? "Gana Rapero A"
                        : b.prediction === "B"
                        ? "Gana Rapero B"
                        : b.prediction}
                    </td>
                    <td>${b.amount?.toFixed(0)}</td>
                    <td>
                      {b.paid ? (
                        <span className="badge bg-success">Pagada</span>
                      ) : (
                        <span className="badge bg-warning text-dark">
                          Pendiente
                        </span>
                      )}
                    </td>
                    <td>
                      {/* Solo muestro botón de cancelar si no está pagada.
                          El backend se encarga de validar si la batalla ya tiene ganador. */}
                      {!b.paid && (
                        <button
                          className="btn btn-outline-accent btn-sm"
                          onClick={() => handleCancelBet(b.id)}
                        >
                          Cancelar apuesta
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBets;

