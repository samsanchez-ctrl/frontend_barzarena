import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isLoggedIn } = useAuth();

  return (
    <>
      {/* PRIMER BLOQUE: TARJETAS PRINCIPALES */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card-urban h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h1 className="page-title mb-0">BARZARENA</h1>
              <span className="badge-accent">Auspiciado por Freestyle Master Series y Urban Roosters</span>
            </div>
            <p className="text-muted-soft">
              Plataforma para apostar en batallas de rap  y comprar productos
              oficiales.
            </p>

            <div className="mt-4 row g-3">
              <div className="col-md-6">
                <div className="card-urban-soft h-100">
                  <small className="text-muted-soft">01</small>
                  <h5 className="mt-2">Apuesta en batallas</h5>
                  <p className="text-muted-soft">
                    Elige tu rapero favorito, predice el ganador y gana saldo si
                    aciertas.
                  </p>
                  <Link to="/battles" className="btn btn-accent btn-sm">
                    Ver batallas
                  </Link>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card-urban-soft h-100">
                  <small className="text-muted-soft">02</small>
                  <h5 className="mt-2">Tienda urbana</h5>
                  <p className="text-muted-soft">
                    Poleras, gorras, álbumes y polerones inspirados en la cultura
                    del freestyle.
                  </p>
                  <Link to="/products" className="btn btn-accent btn-sm">
                    Ir a tienda
                  </Link>
                </div>
              </div>
            </div>

            {!isLoggedIn && (
              <div className="mt-4 d-flex flex-wrap gap-2">
                <Link to="/register" className="btn btn-accent">
                  Crear cuenta
                </Link>
                <Link to="/login" className="btn btn-accent">
                  Ya tengo cuenta
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card-urban h-100">
            <h5 className="mb-3">Flujo básico</h5>
            <ol className="text-muted-soft" style={{ paddingLeft: "1.2rem" }}>
              <li>Regístrate, inicia sesion y disfruta de un sitio web lleno de oportunidades.</li>
              <li>Carga saldo a tu cuenta.</li>
              <li>Apuesta en batallas activas y compra productos en nuestra tienda ultra exclusiva.</li>
              <li>¡ Gana saldo apostando en las marivollasas batallas entre raperos experimentados !</li>
            </ol>

            <div className="mt-3">
              <span className="chip me-2">#Freestyle Master Series</span>
              <span className="chip me-2">#Urban Roosters</span>
              <span className="chip">#Battle</span>
            </div>
          </div>
        </div>
      </div>

      {/* SEGUNDO BLOQUE: VIDEO DESTACADO */}
      <div className="mt-4">
        <div className="card-urban">
          <h4 className="mb-2">Batalla destacada: Pandora vs Fat N</h4>
          <p className="text-muted-soft mb-3">
            Revive una de las batallas clave del circuito. Ajusta el volumen y
            disfruta del freestyle.
          </p>

          {/* contenedor responsive tamaño medio */}
          <div className="ratio ratio-16x9" style={{ maxWidth: "720px", margin: "0 auto" }}>
            <video
              src="/pandoravsfatn.mp4"
              controls
              style={{ borderRadius: "16px", width: "100%", height: "100%" }}
            >
              Tu navegador no soporta video HTML5.
            </video>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
