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
      navbarNav.style.padding = "5%";
      navbarNav.style.marginTop = "5%";
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
                >
                  {route.icon} {route.name}
                </Nav.Link>
              ))}
              <Nav.Link onClick={openSettings}><FaGear /> Ajustes</Nav.Link>
              <Nav.Link onClick={handleShowHelp}><MdHelp /> Ayuda</Nav.Link>
              <Nav.Link as={Link} to="/"><FaDoorOpen /> Salir</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div style={{ height: "100%", paddingTop: "6%" }}>
        {pedido && (
          isMobile ? (
            <>
              {/* Botón único para mostrar/ocultar */}
              <Button
                variant="success"
                size="sm"
                onClick={() => setShowOrder(o => !o)}
                style={{ position: "absolute", top: "15%", right: "2%", zIndex: 1000 }}
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
                  <Offcanvas.Title style={{fontSize: 34, textAlign: 'center', width: '100%'}} >Pedido</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',}}>
                  <p style={{fontSize: 34}}>Croquetas: {pedido.cantidad}</p>
                  {pedido.relleno?.img && (
                    <img
                      src={pedido.relleno.img}
                      alt={pedido.relleno.nombre}
                      className="order-bubble__img"
                      style={{ width: "200%"}}
                    />
                  )}
                  {pedido.tiemposcoccion?.img && (
                    <img
                      src={pedido.tiemposcoccion.img}
                      alt={pedido.tiemposcoccion.nombre}
                      className="order-bubble__img"
                      style={{ width: "200%"}}
                    />
                  )}
                  <p style={{fontSize: 34}}>Salsa: {pedido.salsa}</p>
                </Offcanvas.Body>
              </Offcanvas>
            </>
          ) : (
            // En escritorio, siempre visible
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
                width: "20%",
                maxWidth: "20%",
                color: "black",
              }}
            >
              <h5 style={{ marginBottom: "8%", fontWeight: "bold", fontSize: "1.8rem" }}>
                Pedido
              </h5>
              <p style={{ margin: 0, fontSize: "1.5rem" }}>Croquetas: {pedido.cantidad}</p>
              {pedido.relleno?.img && (
                <div style={{ margin: "1% 0" }}>
                  <img style={{marginLeft: 50}}
                    src={pedido.relleno.img}
                    alt={pedido.relleno.nombre}
                    className="order-bubble__img"
                  />
                </div>
              )}
              {pedido.tiemposcoccion?.img && (
                <div style={{ margin: "1% 0" }}>
                  <img style={{marginLeft: 50}}
                    src={pedido.tiemposcoccion.img}
                    alt={pedido.tiemposcoccion.nombre}
                    className="order-bubble__img"
                  />
                </div>
              )}
              <p style={{ margin: 0, marginTop: "1%", fontSize: "1.5rem" }}>
                Salsa: {pedido.salsa}
              </p>
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
            <p>En esta estación el cliente hace su pedido. Haz clic en su burbuja para conocerlo.</p>
          )}
          {location.pathname.includes("bechamel") && (
            <p>Aquí preparas la masa con bechamel y el relleno indicado por el cliente.</p>
          )}
          {location.pathname.includes("empanado") && (
            <p>Empana las croquetas pasándolas por harina, huevo y pan rallado.</p>
          )}
          {location.pathname.includes("fritura") && (
            <p>Fríe las croquetas durante el tiempo justo para que queden doradas.</p>
          )}
          {location.pathname.includes("emplatado") && (
            <p>Coloca las croquetas en el plato con la salsa que pidió el cliente.</p>
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
