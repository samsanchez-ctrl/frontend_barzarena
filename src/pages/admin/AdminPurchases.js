import React, { useEffect, useState } from "react";
import api from "../../api";

const AdminPurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [error, setError] = useState(null);

  const loadPurchases = async () => {
    setError(null);
    try {
      // Puedes usar /api/purchases/admin/all o /api/admin/history/purchases
      const res = await api.get("/api/purchases/admin/all");
      setPurchases(res.data);
    } catch (e) {
      setError("No se pudieron cargar las compras.");
    }
  };

  useEffect(() => {
    loadPurchases();
  }, []);

  return (
    <div>
      <h2 className="page-title mb-3">Compras (Admin)</h2>
      {error && <div className="alert alert-danger py-2">{error}</div>}

      {purchases.length === 0 ? (
        <p className="text-muted-soft">No hay compras registradas.</p>
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

export default AdminPurchases;
