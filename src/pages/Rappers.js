import React, { useEffect, useState } from "react";
import api from "../api";

const Rappers = () => {
  const [rappers, setRappers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRappers = async () => {
    try {
      const res = await api.get("/api/rappers");
      setRappers(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRappers();
  }, []);

  return (
    <div>
      <h2 className="page-title mb-3">Raperos</h2>
      <p className="text-muted-soft mb-4">
        Lista de raperos activos en las batallas.
      </p>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="row g-3">
          {rappers.map((r) => (
            <div className="col-md-4" key={r.id}>
              <div className="card-urban-soft h-100">
                <h5>{r.name}</h5>
                {r.origin && (
                  <span className="chip mb-2">📍 {r.origin}</span>
                )}
                {r.realName && (
                  <p className="text-muted-soft mb-1">
                    Nombre real: {r.realName}
                  </p>
                )}
                {r.bio && (
                  <p className="text-muted-soft small">
                    {r.bio.length > 180 ? r.bio.slice(0, 180) + "..." : r.bio}
                  </p>
                )}
              </div>
            </div>
          ))}
          {rappers.length === 0 && (
            <p className="text-muted-soft">
              No hay raperos cargados aún.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Rappers;
