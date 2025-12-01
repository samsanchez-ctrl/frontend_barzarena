import React, { useEffect, useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/cart");
      setCart(res.data);
    } catch (e) {
      console.error(e);
      setError("No se pudo cargar el carrito");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleUpdateQty = async (itemId, qty) => {
    try {
      await api.put(`/api/cart/item/${itemId}`, null, {
        params: { qty },
      });
      loadCart();
    } catch (e) {
      setError("No se pudo actualizar la cantidad");
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await api.delete(`/api/cart/item/${itemId}`);
      loadCart();
    } catch (e) {
      setError("No se pudo eliminar el item");
    }
  };

  const handleClear = async () => {
    try {
      await api.delete("/api/cart/clear");
      loadCart();
    } catch (e) {
      setError("No se pudo limpiar el carrito");
    }
  };

  if (loading) return <p>Cargando carrito...</p>;

  if (!cart || cart.items?.length === 0) {
    return (
      <div>
        <h2 className="page-title mb-3">Carrito</h2>
        <p className="text-muted-soft">Tu carrito está vacío.</p>
        <Link to="/products" className="btn btn-accent">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="page-title mb-3">Carrito</h2>
      {error && <div className="alert alert-danger py-2">{error}</div>}

      <table className="table table-dark-urban align-middle">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {cart.items.map((item) => (
            <tr key={item.id}>
              <td>{item.productName}</td>
              <td>${item.price?.toFixed(0)}</td>
              <td style={{ maxWidth: "110px" }}>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={item.quantity}
                  onChange={(e) =>
                    handleUpdateQty(item.id, parseInt(e.target.value, 10))
                  }
                />
              </td>
              <td>${item.subtotal?.toFixed(0)}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleRemove(item.id)}
                >
                  Quitar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <button className="btn btn-outline-danger" onClick={handleClear}>
          Vaciar carrito
        </button>
        <div>
          <span className="me-3">
            Total: <strong>${cart.total?.toFixed(0)}</strong>
          </span>
          <button
            className="btn btn-accent"
            onClick={() => navigate("/checkout")}
          >
            Ir al checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
