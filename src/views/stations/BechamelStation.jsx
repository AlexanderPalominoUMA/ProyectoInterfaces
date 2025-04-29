import { useEffect, useState } from "react";
import { Alert, Col, Row } from "react-bootstrap";
import DraggableItem from "../../components/DraggableItem";
import MilkMinigame from "../minigames/MilkMinigame";
import IngredientMinigame from "../minigames/IngredientMinigame";
import { useOutletContext } from "react-router";
import { toast } from 'react-toastify'; //Para avisos

function BechamelStation() {
  
  const ITEMS = [
    [
      { id: "pollo", src: "/images/pollo.png", hidden_at: 0 },
      { id: "jamon", src: "/images/jamon.png", hidden_at: 0 },
      { id: "espinacas", src: "/images/espinacas.png", hidden_at: 0 },
      { id: "bechamel", src: "/images/packBechamel.png", hidden_at: -1 },
    ],
    [
      { id: "bol", src: "/images/bol.png", hidden_at: null },
    ],
  ];

  const STEPS = [
    { ids: [["bechamel"], "bol"], modal: <MilkMinigame /> }, // Primer paso
    { ids: [["pollo", "jamon"], "bol"], modal: <IngredientMinigame /> }, // Segundo paso
  ];

  const { finishedStations, setFinishedStations } = useOutletContext();
  const [currentStep, setCurrentStep] = useState(
    finishedStations.includes("bechamel") ? STEPS.length : -1
  );

  console.log("PASO AHORA MISMO: " + currentStep)

  const handleDrop = (droppedId, targetId) => {
    console.log(`Dropped ${droppedId} onto ${targetId}`);

    setCurrentStep((prevStep) => {
      const nextStep = prevStep + 1;
      const step = STEPS[nextStep];
      const step_ids = step?.ids ?? [];
      const current_ids = [droppedId, targetId];

      if (
        step_ids.length > 0 &&
        step_ids[0].includes(current_ids[0]) &&
        step_ids[1] === current_ids[1]
      ) {
        console.log(`Updating step from ${prevStep} to ${nextStep}`);
        return nextStep;
      }

      toast("Ooops... Eso no parece estar bien.", {
        position: "top-right",
        type: "error",
      });

      return prevStep;
    });
  };

  useEffect(() => {
    if (currentStep === STEPS.length - 1) {
      setFinishedStations((oldStations) => ["bechamel", ...oldStations]);
    }
  }, [currentStep]);

  return (
    <>
      <div
        style={{
          backgroundImage: "url('/images/estacion.png')", // Ruta de la imagen de fondo
          backgroundSize: "cover", // Cambiado a "cover" para que la imagen cubra todo el área
          backgroundPosition: "center", // Centra la imagen
          backgroundRepeat: "no-repeat", // Evita la repetición y el reflejo de la imagen
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1, // Fondo debajo de todo el contenido
        }}
    ></div>
    
      <div style={{ position: "relative", zIndex: 1 }}>
        {currentStep >= STEPS.length && (
          <Alert className="justify-content-center" variant="success">
            <strong>¡Pasa a la siguiente estación!</strong>
          </Alert>
        )}

        {ITEMS.map((cols, i) => (
          <Row key={`items-col-${i}`}>
            {cols.map((item) => {
              // Solo mostrar el pollo, jamón y espinacas después de que el MilkMinigame se haya completado
              const shouldShowItem =
                (item.id !== "bechamel" || currentStep === -1) && // Mostrar "packBechamel" solo en el primer paso
                (currentStep > 0 || item.hidden_at === null || currentStep >= item.hidden_at);

              return (
                shouldShowItem && (
                  <Col key={item.id}>
                    <DraggableItem
                      id={item.id}
                      src={item.src}
                      onDrop={handleDrop}
                    />
                  </Col>
                )
              );
            })}
          </Row>
        ))}
        {STEPS[currentStep]?.modal ?? ""}
      </div>
    </>
  );
}

export default BechamelStation;
