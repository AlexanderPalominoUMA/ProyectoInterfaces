import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

const CLIENTS = [
  { id: "mujer",  src: "/images/clientes/mujerIdle.png" },
  { id: "hombre", src: "/images/clientes/hombreIdle.png" },
];

function CajaStation() {
  const [currentClient, setCurrentClient] = useState(null);

  const pickRandomClient = () => {
    const idx = Math.floor(Math.random() * CLIENTS.length);
    setCurrentClient(CLIENTS[idx]);
  };

  useEffect(() => {
    pickRandomClient();
  }, []);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {/* Fondo de la estación */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%",
          height: "100%",
          background: "url('/images/estacionCaja.png') center/cover no-repeat",
          zIndex: -1,
        }}
      />

      {/* Contenedor principal que ocupa todo el alto y centra su contenido */}
      <Container
        fluid
        className="position-relative p-0 h-100 d-flex justify-content-center align-items-center"
      >
        {/* Marco con sombra y fondo claro */}
        {currentClient && (
          <Col
            xs={6}
            md={4}
            lg={3}
            xl={2}
            className="bg-light shadow p-3 rounded d-flex justify-content-center align-items-end"
            style={{ maxWidth: "200px" }}
          >
            <img
              src={currentClient.src}
              alt={currentClient.id}
              className="img-fluid"
            />
          </Col>
        )}
      </Container>

    </div>
  );
}

export default CajaStation;
