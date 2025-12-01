import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="card-urban">
      <h2 className="page-title mb-3">Panel Admin</h2>
      <p className="text-muted-soft">
        Gestión básica de productos, raperos, batallas y compras.
      </p>

      <div className="row g-3 mt-2">
        <div className="col-md-3">
          <div className="card-urban-soft h-100">
            <h5>Productos</h5>
            <p className="text-muted-soft">Crear / editar / eliminar merch.</p>
            <Link to="/admin/products" className="btn btn-accent btn-sm">
              Abrir
            </Link>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card-urban-soft h-100">
            <h5>Raperos</h5>
            <p className="text-muted-soft">Gestiona el roster de raperos.</p>
            <Link to="/admin/rappers" className="btn btn-accent btn-sm">
              Abrir
            </Link>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card-urban-soft h-100">
            <h5>Batallas</h5>
            <p className="text-muted-soft">Configura batallas y ganadores.</p>
            <Link to="/admin/battles" className="btn btn-accent btn-sm">
              Abrir
            </Link>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card-urban-soft h-100">
            <h5>Compras</h5>
            <p className="text-muted-soft">Historial global de compras.</p>
            <Link to="/admin/purchases" className="btn btn-accent btn-sm">
              Abrir
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
