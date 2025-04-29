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
    <div
        style={{
          backgroundImage: "url('/images/fondoInicio.png')", // Ruta de la imagen de fondo
          backgroundSize: "cover", // Cambiado a "cover" para que la imagen cubra todo el área
          backgroundPosition: "center", // Centra la imagen
          backgroundRepeat: "no-repeat", // Evita la repetición y el reflejo de la imagen
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1, // Fondo debajo de todo el contenido
        }}
    ></div>
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Row>
          <Col>
          <div>
            <img
              className="title"
              src="/images/logoInicio.gif" // Ruta de tu GIF
              alt="GIF de animación"
              style={{
                width:"500px",
                height:"auto",
              }}
            />
          </div>
            <Container className="main-menu">
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
