import "../../styles/BechamelStyle.css";
import { useEffect, useState, useRef } from "react";
import { Alert, Container, Row, Col, Button, ProgressBar } from "react-bootstrap";
import DraggableItem from "../../components/DraggableItem";
import { useOutletContext } from "react-router";
import { toast } from "react-toastify";

const STATION_ITEMS = [
  { id: "bol", src: "/images/bol.png" },
  { id: "bechamel", src: "/images/packBechamel.png" }
];

const INGREDIENT_ITEMS = [
  { id: "bol", src: "/images/bol.png" },
  { id: "pollo", src: "/images/pollo.png" },
  { id: "jamon", src: "/images/jamon.png" },
  { id: "espinacas", src: "/images/espinacas.png" }
];

function BechamelStation() {
  const { pedido, setFinishedStations, finishedStations } = useOutletContext();

  const [currentStep, setCurrentStep] = useState(
    finishedStations.includes("bechamel") ? 4 : -1
  );
  const [milkPosition, setMilkPosition] = useState(0);
  const [finishedMixture, setFinishedMixture] = useState(false);
  const [mixPosition, setMixPosition] = useState(0);
  const [isMixing, setIsMixing] = useState(false);

  const milkIntervalRef = useRef(null);
  const mixTimeoutRef = useRef(null);

  // Paso 1: animar vertido de leche
  useEffect(() => {
    if (currentStep === 1) {
      milkIntervalRef.current = setInterval(() => {
        setMilkPosition(pos => {
          if (pos >= 100) {
            clearInterval(milkIntervalRef.current);
            return 100;
          }
          return pos + 1;
        });
      }, 50);
    }
    return () => clearInterval(milkIntervalRef.current);
  }, [currentStep]);

  // Paso 2: marcar estación como terminada
  useEffect(() => {
    if (currentStep === 2) {
      setFinishedStations(prev => ["bechamel", ...prev]);
    }
  }, [currentStep, setFinishedStations]);

  const handleMilkStop = () => {
    clearInterval(milkIntervalRef.current);
    if (milkPosition >= 40 && milkPosition <= 70) {
      toast.success("¡Perfecto!");
      setCurrentStep(2);
    } else {
      toast.warning(milkPosition < 40 ? "Has añadido muy poco" : "Has añadido demasiado");
    }
    setFinishedMixture(true);
  };

  const handleMixClick = () => {
    setIsMixing(true);
    setMixPosition(pos => {
      const next = pos + 10;
      if (next >= 100) {
        setIsMixing(false);
        setCurrentStep(3);
        return 100;
      }
      return next;
    });
    clearTimeout(mixTimeoutRef.current);
    mixTimeoutRef.current = setTimeout(() => setIsMixing(false), 300);
  };

  // Renderiza bol + pack de bechamel para paso inicial y paso 2
  const renderStationRow = () => (
    <Row className="draggable-row w-100 justify-content-around mb-4">
      {STATION_ITEMS.map(item => {
        const show =
          (item.id === "bechamel" && currentStep === -1) ||
          (item.id === "bol" && (currentStep === -1 || currentStep === 2));
        if (!show) return null;
        return (
          <Col
            key={item.id}
            xs={4}
            md={6}
            lg={4}
            className="d-flex justify-content-center align-items-center"
          >
            <DraggableItem
              id={item.id}
              src={item.src}
              draggable
              className={`img-fluid ${item.id === "bol" || item.id === "bechamel" ? "img-large" : ""}`}
              onDrop={droppedId => {
                // paso -1: bechamel → bol
                if (item.id === "bol" && currentStep === -1) {
                  if (droppedId === "bechamel") setCurrentStep(1);
                  else toast.warning("Ingrediente incorrecto");
                }
              }}
            />
          </Col>
        );
      })}
    </Row>
  );

  // Renderiza ingredientes + bol para el paso 2
  const renderIngredientsRow = () => (
    <Row className="draggable-row w-100 justify-content-around mb-4">
      {INGREDIENT_ITEMS.map(item => (
        <Col
          key={item.id}
          xs={{ span: (item.id === 'bol' ? 6 : 4), order: (item.id === 'bol' ? 3 : 1) }}
          md={{ span: (item.id === 'bol' ? 3 : 2), order: 'initial' }}
          className="d-flex justify-content-center align-items-center"
        >
          <DraggableItem
            id={item.id}
            src={item.src}
            draggable
            className="img-fluid"
            onDrop={droppedId => {
              // paso 2: relleno → bol
                if (item.id === "bol" && currentStep === 2) {
                  if (droppedId === pedido.relleno.nombre.toLowerCase()) {
                    setCurrentStep(3);
                  } else {
                    toast.warning("Ingrediente incorrecto");
                  }
                }
            }}
          />
        </Col>
      ))}
    </Row>
  );

  useEffect(() => {
    if (currentStep === 4) {
      toast.success("¡Has terminado la estación de bechamel!");
    }
  }, [currentStep]);


  return (
    <Container
    fluid
    className="bechamel-station d-flex align-items-center justify-content-center vh-100">
      <div className="station-content">

          {/* Paso -1 y 2: targets */}
        {currentStep < 1 && renderStationRow()}
        {currentStep === 2 && renderIngredientsRow()}

        {/* Paso 1: vertido de leche */}
        {currentStep === 1 && (
          <>
            <img
              src="/images/milkMinigame.gif"
              alt="Vertiendo leche"
              className="animation-img"
            />
            <div className="progress-wrapper">
              <ProgressBar
                now={milkPosition}
                variant={milkPosition >= 40 && milkPosition <= 70 ? "success" : "warning"}
              />
            </div>
            <div className="button-group d-flex justify-content-center gap-3 mt-3">
              <Button onClick={handleMilkStop}>Parar</Button>
              <Button disabled={!finishedMixture} onClick={() => setCurrentStep(2)}>
                Listo
              </Button>
            </div>
          </>
        )}

        {/* Paso 3: mezclar */}
        {currentStep >= 3 && (
          <>
            <img
              src={isMixing ? "/images/mezclar.gif" : "/images/mezclar_paused.png"}
              alt="Mezclando"
              className="animation-img"
            />
            <div className="progress-wrapper">
              <ProgressBar now={mixPosition} variant={mixPosition >= 100 ? "success" : "info"} />
            </div>
            <div className="button-group d-flex justify-content-center gap-3 mt-3">
              <Button onClick={handleMixClick} disabled={mixPosition >= 100}>
                Batir
              </Button>
              <Button disabled={mixPosition < 100} onClick={() => setCurrentStep(4)}>
                Listo
              </Button>
            </div>
          </>
        )}
      </div>
    </Container>
  );
}

export default BechamelStation;
