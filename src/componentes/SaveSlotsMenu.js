import React, { useState } from "react";
import { Container, Button as BootstrapButton } from "react-bootstrap"; // Solo importamos Container y Button de Bootstrap
import "../estilos/SaveSlotsMenu.css";
import Button from "./Button";

function SaveSlotsMenu({ mode, onSelectSlot, onBack }) {
  const slots = [1, 2, 3];
  const [confirmAction, setConfirmAction] = useState(null);
  const [update, setUpdate] = useState(0);

  const getSlotData = (slot) => {
    const data = localStorage.getItem(`saveSlot${slot}`);
    return data ? JSON.parse(data) : null;
  };

  const handleNewGame = (slot) => {
    const newSave = {
      nombre: `Fecha de creacion:`,
      timestamp: Date.now(),
      progreso: {}
    };
    localStorage.setItem(`saveSlot${slot}`, JSON.stringify(newSave));
    setConfirmAction(null);
    setUpdate((prev) => prev + 1);
    onSelectSlot(slot);
  };

  const handleLoadGame = (slot) => {
    const data = getSlotData(slot);
    if (data) {
      onSelectSlot(slot);
    } else {
      alert("Este espacio está vacío.");
    }
  };

  const requestConfirm = (slot, actionType) => {
    setConfirmAction({ slot, actionType });
  };

  const cancelConfirm = () => {
    setConfirmAction(null);
  };

  const handleDeleteConfirmed = (slot) => {
    localStorage.removeItem(`saveSlot${slot}`);
    setConfirmAction(null);
    setUpdate((prev) => prev + 1);
  };

  return (
    <Container className="save-slots-menu">
      <h2 className="text-center">
        {mode === "load" ? "Cargar Partida" : "Nueva Partida"}
      </h2>
      <div className="slots">
        {slots.map((slot) => {
          const data = getSlotData(slot);
          return (
            <div key={slot} className="slot-card text-center">
              <h3>Espacio {slot}</h3>
              {data ? (
                <>
                  <p>{data.nombre}</p>
                  <p>{new Date(data.timestamp).toLocaleString()}</p>
                  {mode === "load" ? (
                    <>
                      <Button
                        onClick={() => handleLoadGame(slot)}
                        className={
                          confirmAction &&
                          confirmAction.slot === slot &&
                          confirmAction.actionType === "delete"
                            ? "play-button-disabled"
                            : "play-button"
                        }
                      >
                        Jugar
                      </Button>
                      {confirmAction &&
                      confirmAction.slot === slot &&
                      confirmAction.actionType === "delete" ? (
                        <>
                          <div className="confirmation-message">
                            <p>¿Seguro que quieres eliminarlo?</p>
                          </div>
                          <div className="confirmation-buttons">
                            <Button onClick={() => handleDeleteConfirmed(slot)} className="confirm-button">
                              Confirmar
                            </Button>
                            <Button onClick={cancelConfirm} className="cancel-button">
                              Cancelar
                            </Button>
                          </div>
                        </>
                      ) : (
                        <Button onClick={() => requestConfirm(slot, "delete")} className="delete-button">
                          Eliminar
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      {confirmAction &&
                      confirmAction.slot === slot &&
                      confirmAction.actionType === "overwrite" ? (
                        <div className="confirmation-buttons">
                          <Button onClick={() => handleNewGame(slot)} className="confirm-button">
                            Confirmar
                          </Button>
                          <Button onClick={cancelConfirm} className="cancel-button">
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <Button onClick={() => requestConfirm(slot, "overwrite")} className="reset-button">
                          Volver a Empezar
                        </Button>
                      )}
                    </>
                  )}
                </>
              ) : (
                mode === "new" && <Button onClick={() => handleNewGame(slot)}>Nueva</Button>
              )}
            </div>
          );
        })}
      </div>
      <Button className="back-button" onClick={onBack}>Volver</Button>
    </Container>
  );
}

export default SaveSlotsMenu;