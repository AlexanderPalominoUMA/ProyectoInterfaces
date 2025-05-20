import React, { useState, useEffect } from "react";
import { Container, Col } from "react-bootstrap";

const CLIENTS = [
  { id: "mujer", src: "/images/clientes/mujerIdle.png" },
  { id: "hombre", src: "/images/clientes/hombreIdle.png" },
];

const rellenos = [
  { nombre: "Jamón", img: "/images/jamon.png" },
  { nombre: "Pollo", img: "/images/pollo.png" },
  { nombre: "Espinacas", img: "/images/espinacas.png" },
];

const tiemposcoccion = [
  {nombre: "poco hecha", img: "/images/croquetaCruda.png"},
  {nombre: "Hecha", img: "/images/croquetasBien.png"},
  //{nombre: "Quemada", img: "/images/croquetasQuemada.png"}, // Quemado debería de restar puntos
];

const salsas = ["Alioli", "Barbacoa", "Mostaza y miel", "Sriracha"];

function CajaStation() {
  const [currentClient, setCurrentClient] = useState(null);
  const [pedidoPaso, setPedidoPaso] = useState(0);
  const [cantidad, setCantidad] = useState(null);
  const [relleno, setRelleno] = useState(null);
  const [tiempoCoccionElegido, setTiempoCoccionElegido] = useState(null); // Renombrado el estado
  const [salsa, setSalsa] = useState(null);
  const [pedidoCompletado, setPedidoCompletado] = useState(false);

  const pickRandomClient = () => {
    const idx = Math.floor(Math.random() * CLIENTS.length);
    setCurrentClient(CLIENTS[idx]);
    setPedidoPaso(0);
    setCantidad(null);
    setRelleno(null);
    setTiempoCoccionElegido(null); // Actualizado
    setSalsa(null);
    setPedidoCompletado(false);
  };

  const iniciarPedido = () => {
    if (pedidoCompletado) return;

    const numCroquetas = Math.floor(Math.random() * 5) + 1;
    setCantidad(numCroquetas);
    setPedidoPaso(1);

    setTimeout(() => {
      const rellenoElegido = rellenos[Math.floor(Math.random() * rellenos.length)];
      setRelleno(rellenoElegido);
      setPedidoPaso(2);

      setTimeout(() => {
        const tiempoelegido = tiemposcoccion[Math.floor(Math.random() * tiemposcoccion.length)];
        setTiempoCoccionElegido(tiempoelegido); // Actualizado
        setPedidoPaso(3);

        setTimeout(() => {
          const salsaElegida = salsas[Math.floor(Math.random() * salsas.length)];
          setSalsa(salsaElegida);
          setPedidoPaso(4);
          setPedidoCompletado(true);

          // GUARDAR PEDIDO EN localStorage
          localStorage.setItem("pedido", JSON.stringify({
            cantidad: numCroquetas,
            relleno: rellenoElegido,
            tiemposcoccion: tiempoelegido, // Usamos el objeto del tiempo de cocción
            salsa: salsaElegida
          }));
        }, 2000);
      }, 2000);
    }, 2000);
  };

  useEffect(() => {
    pickRandomClient();
  }, []);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {/* Fondo */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "url('/images/estacionCaja.png') center/cover no-repeat",
          zIndex: -1,
        }}
      />

      <Container
        fluid
        className="position-relative p-0 h-100 d-flex justify-content-center align-items-center"
      >
        {currentClient && (
          <Col
            xs={6}
            md={4}
            lg={3}
            xl={2}
            className="bg-light shadow p-3 rounded d-flex justify-content-center align-items-end position-relative"
            style={{ maxWidth: "200px" }}
          >
            {/* Burbuja clicable */}
            <div
              onClick={() => {
                if (pedidoPaso === 0 && !pedidoCompletado) {
                  iniciarPedido();
                }
              }}
              style={{
                position: "absolute",
                top: "-60px",
                background: "#fff",
                borderRadius: "10px",
                padding: "10px",
                border: "2px solid #ccc",
                fontWeight: "bold",
                cursor: pedidoCompletado ? "default" : "pointer",
                color: "black",
                boxShadow: "2px 2px 8px rgba(0,0,0,0.2)",
                zIndex: 10,
                textAlign: "center",
              }}
            >
              {pedidoPaso === 0 && "Haz clic para ver el pedido"}
              {pedidoPaso === 1 && `Quiere ${cantidad} croqueta${cantidad > 1 ? "s" : ""}`}
              {pedidoPaso === 2 && relleno && (
                <img src={relleno.img} alt={relleno.nombre} style={{ width: "40px" }} />
              )}
              {pedidoPaso === 3 && tiempoCoccionElegido && (  // Actualizado a tiempoCoccionElegido
                <img src={tiempoCoccionElegido.img} alt={tiempoCoccionElegido.nombre} style={{ width: "40px" }} />
              )}
              {pedidoPaso === 4 && salsa && salsa}

              <div
                style={{
                  position: "absolute",
                  bottom: "-10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 0,
                  height: 0,
                  borderLeft: "10px solid transparent",
                  borderRight: "10px solid transparent",
                  borderTop: "10px solid #fff",
                }}
              />
            </div>

            {/* Imagen del cliente */}
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
