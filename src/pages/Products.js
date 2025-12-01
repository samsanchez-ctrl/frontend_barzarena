import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// helper: decide qué imagen local usar según el nombre del producto
const getLocalImageForProduct = (name) => {
  if (!name) return null;

  // normalizamos: minúsculas y sin tildes
  const normalize = (str) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const n = normalize(name);

  // Polera BarzArena
  if (n.includes("polera") && n.includes("barzarena")) {
    return "/polerabarzarena.png";
  }

  // Gorra BarzArena
  if (n.includes("gorra") && n.includes("barzarena")) {
    return "/gorrabarzarena.png";
  }

  // Álbum All-Star / All-Stars
  if (n.includes("album") && (n.includes("all-star") || n.includes("all star"))) {
    return "/albumbarzarena.png";
  }

  // Polerón / Poleron BarzArena
  if (n.includes("poleron") && n.includes("barzarena")) {
    return "/poleronbarzarena.png";
  }

  return null;
};

const Products = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [qtyMap, setQtyMap] = useState({});
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  const loadProducts = async () => {
    try {
      const res = await api.get("/api/products");
      setProducts(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleQtyChange = (productId, value) => {
    setQtyMap((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const handleAddToCart = async (productId) => {
    setError(null);
    setMsg(null);
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const qty = parseInt(qtyMap[productId] || "1", 10);
    try {
      await api.post(`/api/cart/add`, null, {
        params: { productId, qty },
      });
      setMsg("Producto agregado al carrito.");
    } catch (err) {
      const apiMsg =
        err.response?.data?.message || "No se pudo agregar al carrito.";
      setError(apiMsg);
    }
  };

  return (
    <div>
      <h2 className="page-title mb-3">Tienda</h2>
      <p className="text-muted-soft mb-3">
        Productos urbanos y merch para los fanáticos del freestyle.
      </p>

      {error && <div className="alert alert-danger py-2">{error}</div>}
      {msg && <div className="alert alert-success py-2">{msg}</div>}

      <div className="row g-3 mt-2">
        {products.map((p) => {
          const localImg = getLocalImageForProduct(p.name);
          const imageSrc = localImg || p.imageUrl || null;

          return (
            <div className="col-md-4" key={p.id}>
              <div className="card-urban-soft h-100 d-flex flex-column">
                {/* IMAGEN DEL PRODUCTO */}
                {imageSrc && (
                  <div className="mb-2 text-center">
                    <img
                      src={imageSrc}
                      alt={p.name}
                      style={{
                        maxHeight: "180px",
                        maxWidth: "100%",
                        borderRadius: "12px",
                        objectFit: "contain",
                        backgroundColor: "#020617",
                      }}
                    />
                  </div>
                )}

                <h5>{p.name}</h5>
                <p className="text-muted-soft flex-grow-1">
                  {p.description || "Producto sin descripción."}
                </p>
                <p className="mb-1">
                  <strong>${p.price?.toFixed(0)}</strong>
                </p>
                <p className="text-muted-soft mb-2">
                  Stock: {p.stock ?? 0}
                </p>

                <div className="d-flex align-items-center gap-2 mt-auto">
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    style={{ maxWidth: "90px" }}
                    value={qtyMap[p.id] || 1}
                    onChange={(e) => handleQtyChange(p.id, e.target.value)}
                  />
                  <button
                    className="btn btn-accent btn-sm"
                    onClick={() => handleAddToCart(p.id)}
                    disabled={p.stock <= 0}
                  >
                    Añadir
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {products.length === 0 && (
          <p className="text-muted-soft">No hay productos disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default Products;
