import { useEffect, useState } from "react";
import { Alert, Col, Row } from "react-bootstrap";
import MilkMinigame from "../minigames/MilkMinigame";
import DraggableItem from "../../components/DraggableItem";
import IngredientMinigame from "../minigames/IngredientMinigame";
import { useOutletContext } from "react-router";
import { toast } from 'react-toastify';

function BechamelStation() {
  /**
   * Estructura de los objectos:
   * Cada array nestado es una fila.
   *
   * Cada objecto contiene:
   * - Un id
   * - La url de la imagen
   * - En qué paso se ocultará el objeto
   */
  const ITEMS = [
    [
      {
        id: "pollo",
        src: "/images/pollo.png",
        hidden_at: 1,
      },
      {
        id: "tacos-jamon",
        src: "/images/tacos-jamon.png",
        hidden_at: 1,
      },
    ],
    [
      {
        id: "bol",
        src: "/images/bol.png",
        hidden_at: null,
      },
      {
        id: "leche",
        src: "/images/leche.png",
        hidden_at: 0,
      },
    ],
  ];

  const STEPS = [
    {
      ids: [["leche"], "bol"],
      modal: <MilkMinigame />,
    },
    {
      ids: [["pollo", "tacos-jamon"], "bol"],
      modal: <IngredientMinigame />,
    },
  ];

  const { finishedStations, setFinishedStations } = useOutletContext();

  const [currentStep, setCurrentStep] = useState(
    finishedStations.includes("bechamel") ? STEPS.length : -1,
  );

  const handleDrop = (droppedId, targetId) => {
    console.log(`Dropped ${droppedId} onto ${targetId}`);

    setCurrentStep((prevStep) => {
      const nextStep = prevStep + 1;

      // Comprobamos si es, en efecto, el siguiente paso
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
        type: "error"
      })

      return prevStep;
    });
  };

  // Mostrar alerta de terminado si no quedan más pasos
  useEffect(() => {
    if (currentStep === STEPS.length - 1) {
      setFinishedStations((oldStations) => ["bechamel", ...oldStations]);
    }
  }, [currentStep]);

  return (
    <>
      <h3>Estación: Bechamel</h3>
      {currentStep >= STEPS.length - 1 && (
        <Alert className="justify-content-center" variant="success">
          <strong>¡Terminado!</strong>
        </Alert>
      )}
      {ITEMS.map((cols, i) => (
        <Row key={`items-col-${i}`}>
          {cols.map((item) => {
            return (
              (item.hidden_at === null || currentStep < item.hidden_at) && (
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
      {/* Modal a renderizar actual (para paso actual) */}
      {STEPS[currentStep]?.modal ?? ""}
    </>
  );
}

export default BechamelStation;
