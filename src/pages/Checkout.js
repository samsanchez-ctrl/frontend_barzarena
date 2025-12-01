import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { auth, refreshUser } = useAuth();
  const [cart, setCart] = useState(null);
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const loadCart = async () => {
    try {
      const res = await api.get("/api/cart");
      setCart(res.data);
    } catch (e) {
      setError("No se pudo cargar el carrito");
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleCheckout = async () => {
    setError(null);
    setMsg(null);
    setProcessing(true);
    try {
      const res = await api.post("/api/purchases/checkout");
      setMsg("Compra realizada correctamente.");
      await refreshUser();
      setTimeout(() => navigate("/my-purchases"), 1500);
      console.log("Purchase response:", res.data);
    } catch (err) {
      const apiMsg =
        err.response?.data?.message ||
        err.response?.data ||
        "No se pudo realizar la compra";
      setError(apiMsg);
    } finally {
      setProcessing(false);
    }
  };

  if (!cart || cart.items?.length === 0) {
    return (
      <div>
        <h2 className="page-title mb-3">Checkout</h2>
        <p className="text-muted-soft">
          Tu carrito está vacío. Agrega productos antes de pagar.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="page-title mb-3">Checkout</h2>
      <p className="text-muted-soft">
        Revisa tu pedido antes de confirmar. Saldo actual:{" "}
        <strong>${auth.saldo?.toFixed(0)}</strong>
      </p>

      {error && <div className="alert alert-danger py-2">{error}</div>}
      {msg && <div className="alert alert-success py-2">{msg}</div>}

      <ul className="list-group mb-3">
        {cart.items.map((item) => (
          <li
            className="list-group-item d-flex justify-content-between"
            key={item.id}
            style={{
              backgroundColor: "#020617",
              color: "#f9fafb",
              borderColor: "#1f2937",
            }}
          >
            <div>
              <strong>{item.productName}</strong>
              <div className="text-muted-soft">
                {item.quantity} x ${item.price?.toFixed(0)}
              </div>
            </div>
            <div>${item.subtotal?.toFixed(0)}</div>
          </li>
        ))}
        <li
          className="list-group-item d-flex justify-content-between"
          style={{
            backgroundColor: "#020617",
            color: "#f9fafb",
            borderColor: "#1f2937",
          }}
        >
          <span>Total</span>
          <strong>${cart.total?.toFixed(0)}</strong>
        </li>
      </ul>

      <button
        className="btn btn-accent"
        onClick={handleCheckout}
        disabled={processing}
      >
        {processing ? "Procesando..." : "Confirmar compra"}
      </button>
    </div>
  );
};

export default Checkout;
