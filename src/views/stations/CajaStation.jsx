import React, { useState, useEffect } from "react";
import { Container, Col } from "react-bootstrap";
import { useOutletContext } from "react-router";
import "../../styles/CajaStation.css"; 

// -- Datos de ejemplo --
const CLIENTS = [
  { id: "mujer", src: "/images/clientes/mujerIdle.png" },
  { id: "hombre", src: "/images/clientes/hombreIdle.png" },
];

const rellenos = [
  { nombre: "Jamon", img: "/images/jamon.png" },
  { nombre: "Pollo", img: "/images/pollo.png" },
  { nombre: "Espinacas", img: "/images/espinacas.png" },
];

const tiemposcoccion = [
  { nombre: "poco hecha", img: "/images/croquetaCruda.png" },
  { nombre: "Hecha", img: "/images/croquetasBien.png" },
  { nombre: "Hecha", img: "/images/croquetasQuemada.png" },
];

const salsas = [
  { nombre: "Ketchup", img: "/images/ketchup.png" },
  { nombre: "Mayonesa", img: "/images/mayonesa.png" },
  { nombre: "Alioli", img: "/images/alioli.png" },
];

function CajaStation() {
  // — Estados —
  const { setFinishedStations } = useOutletContext();
  const [currentClient, setCurrentClient] = useState(null); 
  const [pedidoPaso, setPedidoPaso] = useState(0);
  const [cantidad, setCantidad] = useState(0);
  const [relleno, setRelleno] = useState(null);
  const [tiempoCoccionElegido, setTiempoCoccion] = useState(null);
  const [salsa, setSalsa] = useState(null);
  const [pedidoCompletado, setPedidoCompletado] = useState(false);

  useEffect(() => { // Inicializar el pedido con la cantidad a 0 para evitar errores en las otras estaciones
    if (localStorage.getItem("pedido") === null) {
      localStorage.setItem("pedido", JSON.stringify({
            cantidad: -1/*,
            relleno: r,
            tiemposcoccion: t,
            salsa: s*/
          }));
      }
  },[])

  // — Funciones —
  const pickRandomClient = () => {
    const idx = Math.floor(Math.random() * CLIENTS.length);
    setCurrentClient(CLIENTS[idx]);
    setPedidoPaso(0);
    setCantidad(0);
    setRelleno(null);
    setTiempoCoccion(null);
    setSalsa(null);
    setPedidoCompletado(false);
  };

  const iniciarPedido = () => {
    if (pedidoCompletado) return;

    const num = Math.floor(Math.random() * 5) + 1;
    setCantidad(num);
    setPedidoPaso(1);

    setTimeout(() => {
      const r = rellenos[Math.floor(Math.random() * rellenos.length)];
      setRelleno(r);
      setPedidoPaso(2);

      setTimeout(() => {
        const t = tiemposcoccion[Math.floor(Math.random() * tiemposcoccion.length)];
        setTiempoCoccion(t);
        setPedidoPaso(3);

        setTimeout(() => {
          const s = salsas[Math.floor(Math.random() * salsas.length)];
          setSalsa(s);
          setPedidoPaso(4);
          setPedidoCompletado(true);

          setFinishedStations(prev =>
            prev.includes("caja") ? prev : [...prev, "caja"]
          );

          localStorage.setItem("pedido", JSON.stringify({
            cantidad: num,
            relleno: r,
            tiemposcoccion: t,
            salsa: s
          }));
        }, 2000);
      }, 2000);
    }, 2000);
  };

  // — Pick al montar —
  useEffect(pickRandomClient, []);

  // — Render —
  return (
    <div className="caja-station">
      <div className="caja-station__bg" />

      <Container
        fluid
        className="position-relative h-100 d-flex justify-content-center align-items-center"
      >
        {currentClient && (
          <Col
            xs={8}
            md={6}
            lg={4}
            xl={3}
            className="bg-light shadow caja-station__col d-flex justify-content-center align-items-end position-relative"
          >
            {/* Burbuja */}
            <div
              onClick={() => {
                if (pedidoPaso === 0 && !pedidoCompletado) iniciarPedido();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && pedidoPaso === 0 && !pedidoCompletado) {
                  iniciarPedido();
                }
              }}
              className={
                "order-bubble " +
                (pedidoCompletado ? "order-bubble--disabled" : "")
              }
              tabIndex="0" // Aseguramos que la burbuja sea accesible con el tabulador
              role="button" // Indicamos que esta es una acción de tipo botón
              aria-label="Iniciar pedido" // Descripción para lectores de pantalla
            >
              {pedidoPaso === 0 && "Haz clic para ver el pedido"}
              {pedidoPaso === 1 && `Quiere ${cantidad} croqueta${cantidad > 1 ? "s" : ""}`}
              {pedidoPaso === 2 && relleno && (
                <img
                  src={relleno.img}
                  alt={relleno.nombre}
                  className="order-bubble__img"
                />
              )}
              {pedidoPaso === 3 && tiempoCoccionElegido && (
                <img
                  src={tiempoCoccionElegido.img}
                  alt={tiempoCoccionElegido.nombre}
                  className="order-bubble__img"
                  tabIndex="0"
                />
              )}
              {pedidoPaso === 4 && salsa && (
                <img
                  src={salsa.img}
                  alt={salsa.nombre}
                  className="order-bubble__img"
                  tabIndex="0"
                />
              )}

              <div className="order-bubble__arrow" />
            </div>

            {/* Cliente */}
            <img
              src={currentClient.src}
              alt={currentClient.id}
              className="client-img"
              tabIndex="0" // Hacemos la imagen accesible
              aria-label={`Imagen del cliente ${currentClient.id}`} // Descripción de la imagen
            />
          </Col>
        )}
      </Container>
    </div>
  );
}

export default CajaStation;
