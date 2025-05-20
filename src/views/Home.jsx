import { Col, Container, Modal, Row, Stack } from "react-bootstrap";
import CustomButton from "../components/CustomButton";
import SaveCard from "../components/SaveCard";

import "../styles/home.css";
import { useState } from "react";
import { useSettings } from "../providers/SettingsProvider";
import ReglasModal from "../providers/ReglasProvider";

function Home() {
  const { openSettings } = useSettings();
  const [showReglas, setShowReglas] = useState(false); // Estado para controlar la visibilidad de las reglas
  const [showSaves, setShowSaves] = useState(false);

  const openReglas = () => setShowReglas(true); // Abre el modal de reglas
  const closeReglas = () => setShowReglas(false); // Cierra el modal de reglas

  const [saveSlots, setSaveSlots] = useState([
    { id: 0, createdAt: null, completed: "" },
    { id: 1, createdAt: null, completed: "" },
    { id: 2, createdAt: null, completed: "" },
  ]);

  return (
    <>
      <div className="background-image"></div>
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{ height: "90vh" }}
      >
        <Row>
          <Col>
            <img
              className="title"
              src="/images/logoInicio.gif" // Ruta de tu GIF
              alt="GIF de animación"
            />
            <Container className="main-menu">
              <Stack gap={2} className="align-items-center">
                <CustomButton
                  className="menu-button"
                  onClick={() => setShowSaves(true)}
                  tabIndex="0" // Asegura que los botones sean accesibles con Tab
                >
                  Iniciar juego
                </CustomButton>
                <CustomButton
                  className="menu-button"
                  onClick={openSettings}
                  tabIndex="0"
                >
                  Ajustes
                </CustomButton>
                <CustomButton
                  className="menu-button"
                  onClick={openReglas}
                  tabIndex="0"
                >
                  Reglas
                </CustomButton>
              </Stack>
            </Container>
          </Col>
        </Row>
      </Container>

      {/* Modal de Reglas */}
      <ReglasModal
        show={showReglas}
        close={closeReglas}
        tabIndex="0" // Añadido tabIndex para accesibilidad
        aria-labelledby="reglas-modal-title" // Añadido aria-labelledby
      />

      {/* Modal de guardar partida */}
      <Modal
        centered
        show={showSaves}
        onHide={() => setShowSaves(false)}
        aria-labelledby="save-modal-title" // Añadido aria-labelledby
        tabIndex="0" // Añadido para hacer el modal accesible mediante tabulador
      >
        <Modal.Header closeButton>
          <Modal.Title id="save-modal-title">Partidas de guardado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack gap={3} className="align-items-center">
            {saveSlots.map((slot) => (
              <SaveCard
                key={`slot-${slot.id}`}
                id={slot.id}
                title={`Save ${slot.id + 1}`}
                createdAt={slot.createdAt}
                tabIndex="0" // Añadido tabIndex para cada SaveCard, si es necesario
              />
            ))}
          </Stack>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Home;
