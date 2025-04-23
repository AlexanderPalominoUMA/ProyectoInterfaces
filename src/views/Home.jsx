import { Col, Container, Modal, Row, Stack } from "react-bootstrap";
import CustomButton from "../components/CustomButton";
import SaveCard from "../components/SaveCard";

import "../styles/home.css";
import { useState } from "react";
import { useSettings } from "../providers/SettingsProvider";

function Home() {
  const {openSettings} = useSettings();
  const [showSaves, setShowSaves] = useState(false);

  // TODO: setSaveSlots se deberia de usar para conseguir del localStorage las partidas ya guardadas!
  const [saveSlots, setSaveSlots] = useState([
    {
      id: 0,
      createdAt: null,
      completed: "",
    },
    {
      id: 1,
      createdAt: null,
      completed: "",
    },
    {
      id: 2,
      createdAt: null,
      completed: "",
    },
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
              </Stack>
            </Container>
          </Col>
        </Row>
      </Container>
      {/* Choose save */}
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
