import "../styles/GameRules.css";
import { Modal, Button } from 'react-bootstrap';
import { useEffect, useState } from "react";

function ReglasModal({ show, close }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [rules] = useState([
    { text: "Estacion 1 (Bechamel): Arrastra para batir la leche con la harina cuando la barra esté en verde, y después elegir uno de los 3 ingredientes (según el pedido del cliente para batirlo) haciendo click en batir hasta completar la barra de progreso", image: "/images/bechamel.gif" },
    { text: "Estacion 2 (Empanado): Haz click en el bol para sacar las croquetas, mantén pulsado para arrastrar la croqueta, déjala en la harina, huevo y pan rallado en ese orden y luego sueltalas en el hueco para mandarlas a la siguiente estación", image: "/images/empanado.gif" },
    { text: "Estacion 3 (Fritura): Enciende el aceite haciendo click a las freidoras, y luego vuelve arrastrar las croquetas a las freidoras, cuando su estado de cocción sea el deseado por el cliente haz click nuevamente a la freidora y se sacarán automáticamente", image: "/images/fritura.gif" },
    { text: "Estacion 4 (Emplatado): Elige la salsa que haya pedido el cliente y pulsa las croquetas para ponerlas en el plato, listo!", image: "/images/emplatado.gif", alt: "Emplatado gif" },
  ]);

  // Funcion para que si no se terminan las reglas y se cierra el modal se reinicie la pagina
  useEffect(() => {
    if (!show) {
      setCurrentPage(0);
    }
  }, [show]);

  // Funciones para avanzar y retroceder en las reglas con los botones anterior y siguiente
  const handleNext = () => {
    if (currentPage === rules.length - 1) {
      setCurrentPage(0); // Si es la última página, reinicia a la primera y cierra el modal
      close();
    } else {
      setCurrentPage(currentPage + 1); // Siguiente
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1); // Anterior
    }
  };

  return (
    <Modal centered show={show} onHide={close} dialogClassName="wide-modal">
      <Modal.Header closeButton>
        <Modal.Title>Reglas del Juego</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="game-rules">
          <div className="rule-content">
            <p className="rule-text">{rules[currentPage].text}</p>
            {<img src={rules[currentPage].image} alt="Regla" className="rule-image" />}
          </div>
          <div className="navigation-buttons">
            <Button className="buttonAnteriorReglas" onClick={handlePrevious} disabled={currentPage === 0}> Anterior </Button>
            <Button className="buttonSiguienteReglas" onClick={handleNext}> {currentPage === rules.length - 1 ? 'Terminar' : 'Siguiente'} </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ReglasModal;
