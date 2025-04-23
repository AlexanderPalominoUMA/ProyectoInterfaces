import { useEffect, useState, useRef } from "react";
import { Button, Modal, ProgressBar } from "react-bootstrap";

function MilkMinigame() {
  const [show, setShow] = useState(true);
  const [finished, setFinished] = useState(false);
  const [position, setPosition] = useState(0);
  const intervalRef = useRef(null); // Create a ref to store the interval ID

  const greenZoneStart = 40;
  const greenZoneEnd = 60;

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setPosition((oldPos) => (oldPos >= 100 ? 0 : oldPos + 1));
    }, 150);

    // Cleanup function to clear the interval
    return () => clearInterval(intervalRef.current);
  }, []);

  const isValidZone = () => {
    return position >= greenZoneStart && position <= greenZoneEnd;
  };

  const handleClick = () => {
    if (isValidZone()) {
      setFinished(true);
      // Clear the interval when the game is finished
      clearInterval(intervalRef.current);
    }
  };

  return (
    <Modal show={show} size="lg" aria-labelledby="milk-minigame-modal" centered>
      <Modal.Header>
        <Modal.Title id="milk-minigame-modal">Leche</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Añadir leche</h4>
        <p>Haz click en GO cuando la barra esté verde</p>
        <ProgressBar
          min={0}
          max={100}
          variant={isValidZone() || finished ? "success" : "warning"}
          now={position}
        ></ProgressBar>
        <Button disabled={finished} onClick={handleClick}>
          Go
        </Button>
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={!finished} onClick={() => setShow(false)}>
          Listo
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default MilkMinigame;
