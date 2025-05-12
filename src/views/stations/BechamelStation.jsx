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
      setFinishedStations((oldStations) => ["bechamel", ...oldStations]);
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

    //Habilitamos el botón de Listo
    setFinishedMixture(true)
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
    <>
      <div style={{
        backgroundImage: "url('/images/estacion.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
      }}></div>
      <div style={{ position: "relative", zIndex: 1 }}>
        {currentStep === 4 && (
          <Alert className="justify-content-center" variant="success">
            <strong>¡Pasa a la siguiente estación!</strong>
          </Alert>
        )}

        {ITEMS.map((cols, i) => (
  <Row key={i}>
    {cols.map((item) => {
      // Determinamos aquí si debe mostrarse:
      let shouldShow = false;

      if (item.id === "bechamel") {
        // el paquete de bechamel solo al inicio:
        shouldShow = currentStep === -1;
      } else if (["pollo", "jamon", "espinacas"].includes(item.id)) {
        // aparecen SOLO tras finalizar leche+harina:
        shouldShow = currentStep === 2;
      } else if (item.id === "bol") {
        // el bol siempre está disponible:
        shouldShow = currentStep === -1 || currentStep === 2;
      }

      return (
        shouldShow && (
          <Col key={item.id}>
            <DraggableItem
              id={item.id}
              src={item.src}
              onDrop={(droppedId) => {
                // Paso inicial: solo bechamel
                if (item.id === 'bol' && currentStep === -1) {
                  if (droppedId === 'bechamel') setCurrentStep(1);
                  else toast.warning('Ingrediente incorrecto');
                }
                // Paso ingredientes: solo pollo
                else if (item.id === 'bol' && currentStep === 2) {
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

        {/* Paso 1: leche y harina */}
        {currentStep === 1 && (
          <div className="text-center mb-4">
            <img src="/images/milkMinigame.gif" alt="Animación de leche"/>
            <ProgressBar now={milkPosition} variant={milkPosition >= 40 && milkPosition <= 70 ? "success" : "warning"} className="my-3 w-50 mx-auto" />
            <Button onClick={handleMilkStop}>Parar</Button>
            <Button disabled={!finishedMixture} onClick={() => setCurrentStep(2)}>Listo</Button>
          </div>
        )}

        {/* Paso 3: batir */}
        {currentStep === 3 && (
          <div className="text-center mb-4">
            <img src={isMixing ? "/images/mezclar.gif" : "/images/mezclar_paused.png"} alt="Animación de mezclar"className="img-fluid w-50"/>
            <ProgressBar now={mixPosition} variant={mixPosition >= 100 ? "success" : "info"} className="my-3 w-50 mx-auto" />
            <Button onClick={handleMixClick} disabled={mixPosition >= 100}>Batir</Button>
            <Button disabled={(mixPosition < 100)} onClick={() => setCurrentStep(4)}>Listo</Button>
          </div>
        )}
      </div>
    </>
  );
}

export default BechamelStation;
