import React, { useEffect, useState } from "react";
import api from "../../api";

const emptyForm = {
  id: null,
  name: "",
  description: "",
  price: "",
  stock: "",
  imageUrl: "",
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);

  const loadProducts = async () => {
    setError(null);
    try {
      const res = await api.get("/api/products");
      setProducts(res.data);
    } catch (e) {
      setError("No se pudieron cargar los productos.");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleEdit = (p) => {
    setForm({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      imageUrl: p.imageUrl,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar producto?")) return;
    setError(null);
    setMsg(null);
    try {
      await api.delete(`/api/products/${id}`);
      setMsg("Producto eliminado.");
      loadProducts();
    } catch (e) {
      setError("No se pudo eliminar el producto.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMsg(null);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        imageUrl: form.imageUrl,
      };
      if (form.id) {
        await api.put(`/api/products/${form.id}`, payload);
        setMsg("Producto actualizado.");
      } else {
        await api.post("/api/products", payload);
        setMsg("Producto creado.");
      }
      setForm(emptyForm);
      loadProducts();
    } catch (err) {
      const apiMsg =
        err.response?.data?.message || "No se pudo guardar el producto.";
      setError(apiMsg);
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
  };

  return (
    <div className="row g-3">
      <div className="col-md-7">
        <h2 className="page-title mb-3">Admin Productos</h2>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        {msg && <div className="alert alert-success py-2">{msg}</div>}

        <table className="table table-dark-urban align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>${p.price?.toFixed(0)}</td>
                <td>{p.stock}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-accent me-2"
                    onClick={() => handleEdit(p)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(p.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="5" className="text-muted-soft">
                  No hay productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="col-md-5">
        <div className="card-urban">
          <h4 className="mb-3">
            {form.id ? "Editar producto" : "Nuevo producto"}
          </h4>
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-12">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label">Descripción</label>
              <textarea
                name="description"
                className="form-control"
                rows="2"
                value={form.description}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Precio</label>
              <input
                type="number"
                name="price"
                className="form-control"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Stock</label>
              <input
                type="number"
                name="stock"
                className="form-control"
                value={form.stock}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label">URL imagen (opcional)</label>
              <input
                type="text"
                name="imageUrl"
                className="form-control"
                value={form.imageUrl}
                onChange={handleChange}
              />
            </div>
            <div className="col-12 d-flex justify-content-between">
              <button className="btn btn-accent" type="submit">
                {form.id ? "Actualizar" : "Crear"}
              </button>
              {form.id && (
                <button
                  type="button"
                  className="btn btn-outline-accent"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
