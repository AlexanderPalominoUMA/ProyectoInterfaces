import React, { useState, useEffect } from "react";
import {
  Col,
  Container,
  Nav,
  Navbar,
  Row,
  Modal,
  Button,
  Offcanvas,
} from "react-bootstrap";
import { FaBowlFood, FaCashRegister, FaDoorOpen, FaGear } from "react-icons/fa6";
import { MdHelp } from "react-icons/md";
import { GiSteak } from "react-icons/gi";
import { Link, Outlet, useLocation, useParams } from "react-router";
import { useSettings } from "../providers/SettingsProvider";
import { useSound } from "../providers/SoundProvider"; //sonido
import "../styles/Game.css";


let estadoNavbar = false;

function Game() {
  const { id } = useParams();
  const { openSettings } = useSettings();
  const location = useLocation();

  const [finishedStations, setFinishedStations] = useState([]);
  const [pedido, setPedido] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  // Estado para Offcanvas (nota de pedido)
  const [showOrder, setShowOrder] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 896);
  const { playEffectByName } = useSound(); // Efectos de sonido

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 896;
      setIsMobile(mobile);
      if (!mobile) setShowOrder(false); // cerramos al pasar a desktop
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Carga inicial y periódica del pedido desde localStorage
  useEffect(() => {
    const cargarPedido = () => {
      try {
        const data = localStorage.getItem("pedido");
        if (data) {
          const parsed = JSON.parse(data);
          if (
            parsed?.cantidad &&
            parsed?.relleno &&
            parsed?.tiemposcoccion &&
            parsed?.salsa
          ) {
            setPedido(parsed);
          }
        }
      } catch (err) {
        console.error("Error leyendo el pedido:", err);
      }
    };
    cargarPedido();
    const intervalo = setInterval(cargarPedido, 1000);
    return () => clearInterval(intervalo);
  }, []);

  const BASE_URL = `/game/${id}`;
  const ROUTES = [
    { id: "caja", name: "Caja", icon: <FaCashRegister />, url: BASE_URL },
    { id: "bechamel", name: "Bechamel", icon: <FaBowlFood />, url: `${BASE_URL}/bechamel` },
    { id: "empanado", name: "Empanado", icon: <GiSteak />, url: `${BASE_URL}/empanado` },
    { id: "fritura", name: "Fritura", icon: <GiSteak />, url: `${BASE_URL}/fritura` },
    { id: "emplatado", name: "Emplatado", icon: <FaBowlFood />, url: `${BASE_URL}/emplatado` },
  ];

  // Toggle de navbar (igual que antes)
  const cambiarNavbar = () => {
    const navbar = document.querySelector(".navbar");
    const basicNavbar = document.querySelector(".navbar-collapse");
    const navbarNav = document.querySelector(".navbar-nav");
    if (!estadoNavbar) {
      navbar.style.backgroundColor = "rgba(19, 19, 19, 0.75)";
      document.querySelectorAll(".nav-link").forEach(el => (el.style.color = "white"));
      basicNavbar.style.display = "flex";
      basicNavbar.style.flexDirection = "row";
      basicNavbar.style.justifyContent = "center";
      basicNavbar.style.alignItems = "center";
      navbarNav.style.flexDirection = "row";
      navbarNav.style.gap = "3%";
      navbarNav.style.marginTop = "13%";
    } else {
      navbar.style.backgroundColor = "rgba(19, 19, 19, 0)";
      basicNavbar.style.display = "";
      navbarNav.style.padding = "";
      navbarNav.style.marginTop = "";
    }
    estadoNavbar = !estadoNavbar;
  };

  const handleCloseHelp = () => setShowHelp(false);
  const handleShowHelp = () => setShowHelp(true);

  return (
    <>
      <Navbar expand="lg" fixed="top" style={{ backgroundColor: "rgba(19, 19, 19, 0)" }}>
        <Container>
          <Navbar.Brand>
            <img className="icon" src="/images/logoInicio.gif" alt="GIF de animación" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={cambiarNavbar} />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="estaciones">
              {ROUTES.map((route, i) => (
                <Nav.Link
                  disabled={finishedStations.includes(route.id)}
                  as={Link}
                  key={i}
                  active={route.url === location.pathname}
                  to={route.url}
                  tabIndex="1"
                  onClick={()=>playEffectByName("click")}
                >
                  {route.icon} {route.name}
                </Nav.Link>
              ))}
              <Nav.Link onClick={()=> {playEffectByName("click"); openSettings();}} tabIndex="1"><FaGear /> Ajustes</Nav.Link>
              <Nav.Link onClick={()=>{playEffectByName("click");handleShowHelp();}} tabIndex="1"><MdHelp /> Ayuda</Nav.Link>
              <Nav.Link as={Link} to="/" onClick={()=>playEffectByName("click")} tabIndex="1"><FaDoorOpen /> Salir</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div>
        {pedido && (
          isMobile ? (
            <>
              <Button
                variant="success"
                size="sm"
                onClick={() => setShowOrder(o => !o)}
                style={{ position: "absolute", top: "15%", right: "2%", zIndex: 1000 }}
                tabIndex="0"
              >
                {showOrder ? "Ocultar Pedido" : "Mostrar Pedido"}
              </Button>

              {/* Offcanvas en móvil */}
              <Offcanvas
                show={showOrder}
                onHide={() => setShowOrder(false)}
                placement="end"
              >
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title style={{ fontSize: 34, textAlign: "center", width: "100%" }}>
                    Pedido
                  </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <p style={{ fontSize: 34 }}>Croquetas: {pedido.cantidad}</p>

                  {/* Contenedor flex para mostrar relleno y tiempos de cocción en la misma fila */}
                  {(pedido.relleno?.img || pedido.tiemposcoccion?.img) && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "1rem",
                        margin: "1rem 0",
                      }}
                    >
                      {pedido.relleno?.img && (
                        <img
                          src={pedido.relleno.img}
                          alt={pedido.relleno.nombre}
                          className="order-bubble__img"
                          style={{ width: "200%" }}
                        />
                      )}
                      {pedido.tiemposcoccion?.img && (
                        <img
                          src={pedido.tiemposcoccion.img}
                          alt={pedido.tiemposcoccion.nombre}
                          className="order-bubble__img"
                          style={{ width: "200%" }}
                        />
                      )}
                    </div>
                  )}

                  {/* Imagen de salsa en su propio bloque */}
                  {pedido.salsa?.img && (
                    <img
                      src={pedido.salsa.img}
                      alt={pedido.salsa.nombre}
                      className="order-bubble__img"
                      style={{ width: "200%", margin: "1rem 0" }}
                    />
                  )}
                </Offcanvas.Body>
              </Offcanvas>
            </>
          ) : (
            <div
              className="order-note"
              style={{
                position: "absolute",
                top: "14%",
                right: "2%",
                backgroundColor: "white",
                border: "none",
                borderRadius: "0.5rem",
                padding: "1rem 1.5rem",
                boxShadow: "0 0.5rem 1rem rgba(0,0,0,0.15)",
                zIndex: 20,
                width: "17%",
                maxWidth: "20%",
                color: "black",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <h5 style={{ marginBottom: "8%", fontWeight: "bold", fontSize: "2rem" }}>
                Pedido
              </h5>
              <p style={{ margin: 0, fontSize: "1.8rem" }}>
                Croquetas: {pedido.cantidad}
              </p>

              {/* Contenedor flex para mostrar relleno y tiempos de cocción en la misma fila */}
              {(pedido.relleno?.img || pedido.tiemposcoccion?.img) && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "1rem",
                    margin: "1% 0",
                  }}
                >
                  {pedido.relleno?.img && (
                    <img
                      src={pedido.relleno.img}
                      alt={pedido.relleno.nombre}
                      className="order-bubble__img"
                    />
                  )}
                  {pedido.tiemposcoccion?.img && (
                    <img
                      src={pedido.tiemposcoccion.img}
                      alt={pedido.tiemposcoccion.nombre}
                      className="order-bubble__img"
                    />
                  )}
                </div>
              )}

              {/* Imagen de salsa en su propio bloque */}
              {pedido.salsa?.img && (
                <div style={{ margin: "1% 0" }}>
                  <img
                    src={pedido.salsa.img}
                    alt={pedido.salsa.nombre}
                    className="order-bubble__img"
                  />
                </div>
              )}
            </div>
          )
        )}

        <Container fluid className="h-100 d-flex align-items-center justify-content-center text-center">
          <Row>
            <Col>
              <Outlet
                context={{ finishedStations, setFinishedStations, pedido, setPedido }}
              />
            </Col>
          </Row>
        </Container>
      </div>

      <Modal show={showHelp} onHide={handleCloseHelp} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ayuda de estación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {location.pathname.includes("caja") && (
            <p>Clica en la burbuja del cliente para que te diga el pedido que quiere.</p>
          )}
          {location.pathname.includes("bechamel") && (
            <p>Arrastra para batir la leche con la harina cuando la barra esté en verde, y después elegir uno de los 3 ingredientes (según el pedido del cliente para batirlo) haciendo click en batir hasta completar la barra de progreso</p>
          )}
          {location.pathname.includes("empanado") && (
            <p>Haz click en el bol para sacar las croquetas, mantén pulsado para arrastrar la croqueta, déjala en la harina, huevo y pan rallado en ese orden y luego sueltalas en el hueco para mandarlas a la siguiente estación</p>
          )}
          {location.pathname.includes("fritura") && (
            <p>Enciende el aceite haciendo click a las freidoras, espera un poco a que se caliente el aceite, y arrastra las croquetas a las freidoras, cuando su estado de cocción sea el deseado por el cliente haz click nuevamente a la freidora y se sacarán automáticamente</p>
          )}
          {location.pathname.includes("emplatado") && (
            <p>Elige la salsa que haya pedido el cliente y pulsa las croquetas para ponerlas en el plato, listo!</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseHelp}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Game;
