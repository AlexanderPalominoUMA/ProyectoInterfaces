import { useState, useEffect } from "react";
import { Col, Container, Nav, Navbar, Row, Modal, Button } from "react-bootstrap";
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
  const [score, setScore] = useState(0); // Puntuación

  const handleCloseHelp = () => setShowHelp(false);
  const handleShowHelp = () => setShowHelp(true);

  const BASE_URL = `/game/${id}`;

  const ROUTES = [
    { id: "caja", name: "Caja", icon: <FaCashRegister />, url: BASE_URL },
    { id: "bechamel", name: "Bechamel", icon: <FaBowlFood />, url: `${BASE_URL}/bechamel` },
    { id: "empanado", name: "Empanado", icon: <GiSteak />, url: `${BASE_URL}/empanado` },
    { id: "fritura", name: "Fritura", icon: <GiSteak />, url: `${BASE_URL}/fritura` },
    { id: "emplatado", name: "Emplatado", icon: <FaBowlFood />, url: `${BASE_URL}/emplatado` },
  ];

  useEffect(() => {
    const cargarPedido = () => {
      try {
        const data = localStorage.getItem("pedido");
        if (data) {
          const parsed = JSON.parse(data);
          if (parsed?.cantidad && parsed?.relleno && parsed?.tiemposcoccion && parsed?.salsa) {
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

  const cambiarNavbar = () => {
    const navbar = document.querySelector(".navbar");
    const basicNavbar = document.querySelector(".navbar-collapse");
    const navbarNav = document.querySelector(".navbar-nav");

    if (navbar && estadoNavbar === false) {
      navbar.style.backgroundColor = "rgba(19, 19, 19, 0.75)";
      basicNavbar.style.display = 'flex';
      basicNavbar.style.flexDirection = 'column';
      basicNavbar.style.justifyContent = 'center';
      basicNavbar.style.alignItems = 'center';
      document.querySelectorAll('.nav-link').forEach(el => el.style.color = 'white');
      navbarNav.style.flexDirection = 'row';
      navbarNav.style.padding = '5%';
      navbarNav.style.marginTop = '10%';
      estadoNavbar = true;
    } else if (estadoNavbar === true) {
      navbar.style.backgroundColor = "rgba(19, 19, 19, 0.0)";
      basicNavbar.style.display = '';
      navbarNav.style.padding = '';
      navbarNav.style.marginTop = '';
      estadoNavbar = false;
    }
  };

  return (
    <>
      <Navbar expand="lg" fixed="top" style={{ backgroundColor: 'rgba(19, 19, 19, 0.0)' }}>
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
                  key={`route-${i}`}
                  active={route.url === location.pathname}
                  to={route.url}
                >
                  {route.icon} {route.name}
                </Nav.Link>
              ))}
              <Nav.Link onClick={openSettings}>
                <FaGear /> Ajustes
              </Nav.Link>
              <Nav.Link onClick={handleShowHelp}>
                <MdHelp /> Ayuda
              </Nav.Link>
              <Nav.Link as={Link} to="/">
                <FaDoorOpen /> Salir
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div style={{ height: "100vh", paddingTop: "56px" }}>
        {pedido && (
          <div style={{
            position: "absolute",
            top: "14%",
            right: "20px",
            backgroundColor: "white",
            border: "2px solid #ccc",
            borderRadius: "8px",
            padding: "12px 16px",
            boxShadow: "2px 2px 10px rgba(0,0,0,0.2)",
            zIndex: 20,
            minWidth: "200px",
            color: "black"
          }}>
            <h5 style={{ marginBottom: "10px", fontWeight: "bold" }}>Pedido</h5>
            <p style={{ margin: 0 }}>Croquetas: {pedido.cantidad}</p>

            {/* Imagen de relleno en bloque */}
            {pedido.relleno?.img && (
              <div style={{ margin: '0.5rem 0' }}>
                <img
                  src={pedido.relleno.img}
                  alt={pedido.relleno.nombre}
                  className="order-bubble__img"
                />
              </div>
            )}

            {/* Imagen de cocción en siguiente línea */}
            {pedido.tiemposcoccion?.img && (
              <div style={{ margin: '0.5rem 0' }}>
                <img
                  src={pedido.tiemposcoccion.img}
                  alt={pedido.tiemposcoccion.nombre}
                  className="order-bubble__img"
                />
              </div>
            )}

            {/* Salsa (texto o icono si tienes) */}
            <p style={{ margin: 0, marginTop: '8px' }}>Salsa: {pedido.salsa}</p>
          </div>
        )}

        <Container fluid className="h-100 d-flex align-items-center justify-content-center text-center">
          <Row>
            <Col>
              <Outlet context={{ finishedStations, setFinishedStations, pedido, setPedido }} />
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
