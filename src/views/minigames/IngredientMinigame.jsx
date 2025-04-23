import { useState } from "react";
import { Button, Modal, ProgressBar } from "react-bootstrap";

function IngredientMinigame() {
  const [show, setShow] = useState(true);
  const [position, setPosition] = useState(0);

  const handleClick = () => {
    setPosition((oldPos) => {
      const newPos = oldPos + 10;

      return newPos > 100 ? 100 : newPos;
    });
  };

  return (
    <Modal show={show} size="lg" aria-labelledby="milk-minigame-modal" centered>
      <Modal.Header>
        <Modal.Title id="milk-minigame-modal">Ingrediente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Ingrediente añadido</h4>
        <p>¡Buen trabajo! Ahora toca batirlo todo.</p>

        <ProgressBar
          variant={position >= 100 ? "success" : "info"}
          min={0}
          max={100}
          now={position}
        />
        <Button disabled={position >= 100} onClick={handleClick}>
          Batir
        </Button>
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={position < 100} onClick={() => setShow(false)}>
          Listo
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default IngredientMinigame;
