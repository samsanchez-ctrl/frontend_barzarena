import React, { useEffect, useState } from "react";
import api from "../api";

const MyBets = () => {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBets = async () => {
    setError(null);
    try {
      const res = await api.get("/api/bets/me");
      setBets(res.data);
    } catch (e) {
      setError("No se pudieron cargar tus apuestas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBets();
  }, []);

  if (loading) return <p>Cargando apuestas...</p>;

  return (
    <div>
      <h2 className="page-title mb-3">Mis apuestas</h2>
      {error && <div className="alert alert-danger py-2">{error}</div>}

      {bets.length === 0 ? (
        <p className="text-muted-soft">No tienes apuestas registradas.</p>
      ) : (
        <table className="table table-dark-urban align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Batalla</th>
              <th>Fecha batalla</th>
              <th>Predicción</th>
              <th>Monto</th>
              <th>Pagada</th>
            </tr>
          </thead>
          <tbody>
            {bets.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>#{b.battleId}</td>
                <td>{new Date(b.battleDate).toLocaleString()}</td>
                <td>{b.prediction}</td>
                <td>${b.amount?.toFixed(0)}</td>
                <td>{b.paid ? "Sí" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyBets;
