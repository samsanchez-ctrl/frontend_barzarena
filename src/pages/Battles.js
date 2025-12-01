import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const Battles = () => {
  const [battles, setBattles] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBattles = async () => {
    try {
      const res = await api.get("/api/battles");
      setBattles(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBattles();
  }, []);

  return (
    <div>
      <h2 className="page-title mb-3">Batallas</h2>
      <p className="text-muted-soft mb-4">
        Batallas activas para apostar. Haz click para ver detalles.
      </p>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="row g-3">
          {battles.map((b) => (
            <div className="col-md-4" key={b.id}>
              <div className="card-urban-soft h-100 d-flex flex-column">
                <div className="d-flex justify-content-between mb-2">
                  <span className="chip">
                    {b.rapperA?.name} vs {b.rapperB?.name}
                  </span>
                  <span className="chip">
                    {new Date(b.date).toLocaleString()}
                  </span>
                </div>

                <p className="text-muted-soft flex-grow-1">
                  Estado:{" "}
                  <strong>
                    {b.winner === "NONE" || !b.winner
                      ? "Sin ganador"
                      : `Ganador: ${b.winner}`}
                  </strong>
                </p>

                <Link
                  to={`/battles/${b.id}`}
                  className="btn btn-accent btn-sm mt-auto"
                >
                  Ver detalles / Apostar
                </Link>
              </div>
            </div>
          ))}
          {battles.length === 0 && (
            <p className="text-muted-soft">
              No hay batallas activas por el momento.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Battles;
