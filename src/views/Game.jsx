import { useState, useEffect } from "react";
import { Col, Container, Nav, Navbar, Row, Modal, Button } from "react-bootstrap";
import {
  FaBowlFood,
  FaCashRegister,
  FaDoorOpen,
  FaGear,
} from "react-icons/fa6";
import { GiSteak } from "react-icons/gi";
import { Link, Outlet, useLocation, useParams } from "react-router";
import { useSettings } from "../providers/SettingsProvider";

function Game() {
  const { id } = useParams();
  const { openSettings } = useSettings();
  const location = useLocation();
  const [finishedStations, setFinishedStations] = useState([]);
  const [pedido, setPedido] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

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
          if (parsed?.cantidad && parsed?.relleno && parsed?.salsa) {
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

  return (
    <>
      <Navbar expand="lg" data-bs-theme="dark" fixed="top" style={{ backgroundColor: 'rgba(19, 19, 19, 0.75)' }}>
        <Container style={{ color: "white" }}>
          <Navbar.Brand>
            <img
              className="title"
              src="/images/logoInicio.gif"
              alt="GIF de animación"
              style={{ width: "75px", height: "auto" }}
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto" style={{ color: "white" }}>
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
                ❓ Ayuda
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
            <p style={{ margin: 0 }}>Relleno: {pedido.relleno?.nombre}</p>
            <p style={{ margin: 0 }}>Coccion: {pedido.tiemposcoccion?.nombre}</p>
            <p style={{ margin: 0 }}>Salsa: {pedido.salsa}</p>
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
            <p>Empana las croquetas pasándolas por huevo y pan rallado.</p>
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


