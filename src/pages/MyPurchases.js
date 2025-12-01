import React, { useEffect, useState } from "react";
import api from "../api";

const MyPurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPurchases = async () => {
    setError(null);
    try {
      const res = await api.get("/api/purchases/me");
      setPurchases(res.data);
    } catch (e) {
      setError("No se pudieron cargar tus compras.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPurchases();
  }, []);

  if (loading) return <p>Cargando compras...</p>;

  return (
    <div>
      <h2 className="page-title mb-3">Mis compras</h2>
      {error && <div className="alert alert-danger py-2">{error}</div>}

      {purchases.length === 0 ? (
        <p className="text-muted-soft">No has realizado compras aún.</p>
      ) : (
        <div className="row g-3">
          {purchases.map((p) => (
            <div className="col-md-6" key={p.id}>
              <div className="card-urban-soft">
                <div className="d-flex justify-content-between">
                  <span className="chip">Compra #{p.id}</span>
                  <span className="chip">
                    {new Date(p.date).toLocaleString()}
                  </span>
                </div>
                <p className="mt-2 mb-1">
                  Total: <strong>${p.total?.toFixed(0)}</strong>
                </p>
                <ul className="text-muted-soft small mb-0">
                  {p.items?.map((it, idx) => (
                    <li key={idx}>
                      {it.quantity} x {it.productName} (${it.priceAtPurchase})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPurchases;
