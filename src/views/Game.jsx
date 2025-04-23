import { useState } from "react";
import { Col, Container, Nav, Navbar, Row } from "react-bootstrap";
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
  const {openSettings} = useSettings();
  const location = useLocation();
  const [finishedStations, setFinishedStations] = useState([]);

  const BASE_URL = `/game/${id}`;

  // Todas las rutas disponibles en la barra de navegación
  const ROUTES = [
    {
      id: "caja",
      name: "Caja",
      icon: <FaCashRegister />,
      url: BASE_URL,
    },
    {
      id: "bechamel",
      name: "Bechamel",
      icon: <FaBowlFood />,
      url: `${BASE_URL}/bechamel`,
    },
    {
      id: "empanado",
      name: "Empanado",
      icon: <GiSteak />,
      url: `${BASE_URL}/empanado`,
    },
    {
      id: "fritura",
      name: "Fritura",
      icon: <GiSteak />,
      url: `${BASE_URL}/fritura`,
    },
    {
      id: "emplatado",
      name: "Emplatado",
      icon: <FaBowlFood />,
      url: `${BASE_URL}/emplatado`,
    },
  ];

  return (
    <>
      <Navbar expand="lg" data-bs-theme="dark" fixed="top">
        <Container style={{ color: "white" }}>
          <Navbar.Brand>Tortilla's Croquetería</Navbar.Brand>
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
              <Nav.Link as={Link} to="/">
                <FaDoorOpen /> Salir
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div
        style={{
          height: "100vh",
          // Ajustamos para no tener en cuenta el navbar
          paddingTop: "56px",
        }}
      >
        <Container
          fluid
          className="h-100 d-flex align-items-center justify-content-center text-center"
        >
          <Row>
            <Col>
              <Outlet context={{ finishedStations, setFinishedStations }} />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default Game;
