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
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Row>
          <Col>
            <Container className="main-menu">
              <h1 className="title">Tortilla's Croquetería</h1>
              <Stack gap={3} className="align-items-center">
                <CustomButton
                  className="menu-button"
                  onClick={() => setShowSaves(true)}
                >
                  Iniciar juego
                </CustomButton>
                <CustomButton className="menu-button" onClick={openSettings}>
                  Ajustes
                </CustomButton>
                <CustomButton className="menu-button" onClick={openReglas}>
                  Reglas
                </CustomButton>
              </Stack>
            </Container>
          </Col>
        </Row>
      </Container>

      {/* Modal de Reglas */}
      <ReglasModal show={showReglas} close={closeReglas} />

      {/* Modal de guardar partida */}
      <Modal centered show={showSaves} onHide={() => setShowSaves(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Partidas de guardado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack gap={3} className="align-items-center">
            {saveSlots.map((slot) => (
              <SaveCard
                key={`slot-${slot.id}`}
                id={slot.id}
                title={`Save ${slot.id + 1}`}
                createdAt={slot.createdAt}
              />
            ))}
          </Stack>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Home;
