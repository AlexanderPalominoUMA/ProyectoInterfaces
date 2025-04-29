import { useEffect, useState, useRef } from "react";
import { Button, Modal, ProgressBar } from "react-bootstrap";
import "../../styles/minigames.css";
import { toast } from 'react-toastify';

function MilkMinigame() {
  const [show, setShow] = useState(true);
  const [finished, setFinished] = useState(false);
  const [position, setPosition] = useState(0);
  const [variant, setVariant] = useState("warning");
  const intervalRef = useRef(null); // Create a ref to store the interval ID

  const greenZoneStart = 40;
  const greenZoneEnd = 70;

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setPosition((oldPos) => { 
        if (oldPos >= 100) {
          clearInterval(intervalRef.current); // Detener el intervalo cuando la barra llegue a 100%
          return 100; // Asegurarse de que la barra quede en 100% cuando se detenga
        }
        return oldPos + 1; // Continuar incrementando la barra
      });
    }, 50);  // Intervalo de 50 milisegundos

    // Cleanup function to clear the interval
    return () => clearInterval(intervalRef.current);
  }, []);

  const isValidZone = () => {
    return position >= greenZoneStart && position <= greenZoneEnd;
  };

  // Dentro de MilkMinigame.jsx:

const handleClick = () => {
  // 1) Parar siempre la animación de la barra
  clearInterval(intervalRef.current);

  // 2) Mostrar toast según si ha sido antes o después de la zona verde
  if (position < greenZoneStart) {
    toast("Has añadido muy poco", {
      position: "top-right",
      type: "warning",
    });
  } else if(position >= greenZoneStart && position <= greenZoneEnd ){
    toast("¡Perfecto!", {
      position: "top-right",
      type: "success",
    });
  } else if (position > greenZoneEnd) {
    toast("Has añadido demasiado", {
      position: "top-right",
      type: "warning",
    });
  }

  // 3) Habilitar el botón "Listo"
  setFinished(true);
};


  return (
    <Modal show={show} size="lg" aria-labelledby="milk-minigame-modal" centered>
      <Modal.Header>
        <Modal.Title id="milk-minigame-modal">Leche</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>¡Añadiendo harina y leche!</h4>
        <p>Pulsa PARAR cuando la barra esté en verde</p>
        
        {/* Agregar el GIF antes de la barra de progreso */}
        <div>
          <img
            src="/images/milkMinigame.gif" // Ruta de tu GIF
            alt="GIF de animación"
          />
        </div>

        <ProgressBar
            min={0}
            max={100}
            now={position}
            variant={
              position < greenZoneStart
                ? "warning"
                : position <= greenZoneEnd
                  ? "success"
                  : "danger"
            }
            style={{
              width: "80%",      // Ajusta el tamaño de la barra
              marginBottom: "20px", // Espacio debajo de la barra
            }}
          />

        <Button disabled={finished} onClick={handleClick}>
          Parar
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
