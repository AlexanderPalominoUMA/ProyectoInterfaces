import { useState, useRef, useEffect } from "react";
import { Button, Modal, ProgressBar } from "react-bootstrap";
import "../../styles/minigames.css";

function IngredientMinigame() {
  const [show, setShow] = useState(true);
  const [position, setPosition] = useState(0);
  const [isMixing, setIsMixing] = useState(false);
  const mixTimeoutRef = useRef(null);

  // Limpieza al desmontar
  useEffect(() => {
    return () => clearTimeout(mixTimeoutRef.current);
  }, []);


  const handleClick = () => {
    // 1) Arrancamos la “mezcla”
    setIsMixing(true);
  
    // 2) Avanzamos la barra
    setPosition(oldPos => {
      const newPos = oldPos + 10;
      return newPos > 100 ? 100 : newPos;
    });
  
    // 3) Paramos la animación tras 300 ms
    clearTimeout(mixTimeoutRef.current);
    mixTimeoutRef.current = setTimeout(() => {
      setIsMixing(false);
    }, 300);
  };
  

  return (
    <Modal show={show} size="lg" aria-labelledby="milk-minigame-modal" centered>
      <Modal.Header>
        <Modal.Title id="milk-minigame-modal">Ingrediente correcto añadido</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>¡Buen trabajo! Ahora toca batirlo todo.</p>

        <div>
        <img
          src={ isMixing
            ? "/images/mezclar.gif"
            : "/images/mezclar_paused.png"
          }
          alt="Animación de mezclar"
          style={{ maxWidth: "100%" }}
        />
        </div>

        <ProgressBar
          now={position}
          variant={position >= 100 ? "success" : "info"}
          min={0}
          max={100}
          style={{
            width: "80%",      // ancho del contenedor
            height: "1.5rem",  // opcional, para que se vea más alto
            marginBottom: "20px",
          }}
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
