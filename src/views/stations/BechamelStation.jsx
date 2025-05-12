import "../../styles/BechamelStyle.css";
import { useEffect, useState, useRef } from "react";
import { Alert, Col, Row, Button, ProgressBar } from "react-bootstrap";
import DraggableItem from "../../components/DraggableItem";
import { useOutletContext } from "react-router";
import { toast } from 'react-toastify';

function BechamelStation() {
  const ITEMS = [
    [
      { id: "pollo", src: "/images/pollo.png", hidden_at: 0 },
      { id: "jamon", src: "/images/jamon.png", hidden_at: 0 },
      { id: "espinacas", src: "/images/espinacas.png", hidden_at: 0 },
    ],
    [
      { id: "bol", src: "/images/bol.png", hidden_at: null },
      { id: "bechamel", src: "/images/packBechamel.png", hidden_at: -1 },
    ],
  ];

  const { finishedStations, setFinishedStations } = useOutletContext();

  const [currentStep, setCurrentStep] = useState(
    finishedStations.includes("bechamel") ? 4 : -1
  );
  const [milkPosition, setMilkPosition] = useState(0);
  const [finishedMixture, setFinishedMixture] = useState(false);
  const [mixPosition, setMixPosition] = useState(0);
  const [isMixing, setIsMixing] = useState(false);
  const milkIntervalRef = useRef(null);
  const mixTimeoutRef = useRef(null);

  useEffect(() => {
    if (currentStep === 1) {
      milkIntervalRef.current = setInterval(() => {
        setMilkPosition((oldPos) => {
          if (oldPos >= 100) {
            clearInterval(milkIntervalRef.current);
            return 100;
          }
          return oldPos + 1;
        });
      }, 50);
    }
    return () => clearInterval(milkIntervalRef.current);
  }, [currentStep]);

  useEffect(() => {
    if (currentStep === 2) {
      setFinishedStations((old) => ["bechamel", ...old]);
    }
  }, [currentStep]);

  const handleMilkStop = () => {
    clearInterval(milkIntervalRef.current);
    if (milkPosition >= 40 && milkPosition <= 70) {
      toast.success("¡Perfecto!");
      setCurrentStep(2);
    } else if (milkPosition < 40) {
      toast.warning("Has añadido muy poco");
    } else {
      toast.warning("Has añadido demasiado");
    }
    setFinishedMixture(true);
  };

  const handleMixClick = () => {
    setIsMixing(true);
    setMixPosition((oldPos) => {
      const newPos = oldPos + 10;
      if (newPos >= 100) {
        setIsMixing(false);
        setCurrentStep(3);
        return 100;
      }
      return newPos;
    });

    clearTimeout(mixTimeoutRef.current);
    mixTimeoutRef.current = setTimeout(() => setIsMixing(false), 300);
  };

  return (
    <div className="bechamel-station">
      <div/>
      <div className="station-content">
        {currentStep === 4 && (
          <Alert className="station-alert justify-content-center" variant="success">
            <strong>¡Pasa a la siguiente estación!</strong>
          </Alert>
        )}

        {ITEMS.map((cols, i) => (
          <Row className="draggable-row" key={i}>
            {cols.map((item) => {
              let shouldShow = false;
              if (item.id === "bechamel") {
                shouldShow = currentStep === -1;
              } else if (["pollo", "jamon", "espinacas"].includes(item.id)) {
                shouldShow = currentStep === 2;
              } else if (item.id === "bol") {
                shouldShow = currentStep === -1 || currentStep === 2;
              }
              return (
                shouldShow && (
                  <Col className="draggable-col" key={item.id}>
                    <DraggableItem
                      id={item.id}
                      src={item.src}
                      onDrop={(droppedId) => {
                        if (item.id === 'bol' && currentStep === -1) {
                          if (droppedId === 'bechamel') setCurrentStep(1);
                          else toast.warning('Ingrediente incorrecto');
                        } else if (item.id === 'bol' && currentStep === 2) {
                          if (droppedId === 'pollo') setCurrentStep(3);
                          else toast.warning('Ingrediente incorrecto');
                        }
                      }}
                    />
                  </Col>
                )
              );
            })}
          </Row>
        ))}

        {currentStep === 1 && (
          <div>
            <img
              className="animation-img"
              src="/images/milkMinigame.gif"
              alt="Animación de leche"
            />
            <div className="progress-wrapper">
              <ProgressBar
                now={milkPosition}
                variant={milkPosition >= 40 && milkPosition <= 70 ? "success" : "warning"}
              />
            </div>
            <div className="button-group">
              <Button onClick={handleMilkStop}>Parar</Button>
              <Button disabled={!finishedMixture} onClick={() => setCurrentStep(2)}>
                Listo
              </Button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <img
              className="animation-img"
              src={isMixing ? "/images/mezclar.gif" : "/images/mezclar_paused.png"}
              alt="Animación de mezclar"
            />
            <div className="progress-wrapper">
              <ProgressBar
                now={mixPosition}
                variant={mixPosition >= 100 ? "success" : "info"}
              />
            </div>
            <div className="button-group">
              <Button onClick={handleMixClick} disabled={mixPosition >= 100}>
                Batir
              </Button>
              <Button disabled={mixPosition < 100} onClick={() => setCurrentStep(4)}>
                Listo
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BechamelStation;
