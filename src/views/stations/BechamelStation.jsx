import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router";
import { toast } from "react-toastify";
import { Button, ProgressBar } from "react-bootstrap";
import { useSound } from "../../providers/SoundProvider";
import "../../styles/BechamelStyle.css";

function BechamelStation() {
  const { pedido, setFinishedStations } = useOutletContext();
  const { playEffectByName } = useSound(); // Efectos de sonido

  const bolRef = useRef(null);
  const [step, setStep] = useState(0);
  const [draggedId, setDraggedId] = useState(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [items, setItems] = useState([
    {
      id: "packBechamel",
      x: window.innerWidth * 0.2,
      y: window.innerHeight * 0.5,
      visible: true,
    },
  ]);

  const [milkProgress, setMilkProgress] = useState(0);
  const [isPouring, setIsPouring] = useState(false);
  const milkIntervalRef = useRef(null);
  const [isMixing, setIsMixing] = useState(false);
  const [mixProgress, setMixProgress] = useState(0);

  const [ingredientItems, setIngredientItems] = useState([
    { id: "espinacas", x: window.innerWidth * 0.2, y: window.innerHeight * 0.45 },
    { id: "jamon", x: window.innerWidth * 0.3, y: window.innerHeight * 0.45 },
    { id: "pollo", x: window.innerWidth * 0.4, y: window.innerHeight * 0.45 },
  ]);

  const handleStart = (x, y, id) => {
    setDraggedId(id);
    const item = items.find((i) => i.id === id) || ingredientItems.find(i => i.id === id);
    if (item) setMouseOffset({ x: x - item.x, y: y - item.y });
  };

  const handleMove = (clientX, clientY) => {
    if (draggedId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === draggedId
            ? { ...item, x: clientX - mouseOffset.x, y: clientY - mouseOffset.y }
            : item
        )
      );
      setIngredientItems((prev) =>
        prev.map((item) =>
          item.id === draggedId
            ? { ...item, x: clientX - mouseOffset.x, y: clientY - mouseOffset.y }
            : item
        )
      );
    }
  };

  const handleEnd = () => {
    if (!draggedId) return;

    const bolRect = bolRef.current?.getBoundingClientRect();
    const item = items.find((i) => i.id === draggedId) || ingredientItems.find(i => i.id === draggedId);

    if (item && bolRect) {
      const cx = item.x;
      const cy = item.y;
      if (cx > bolRect.left && cx < bolRect.right && cy > bolRect.top && cy < bolRect.bottom) {
        localStorage.setItem('ingrediente', item.id); // Tener guardado en memoria lo que se ha metido para considerarlo en la puntuación
        if (step === 0 && draggedId === "packBechamel") {
          playEffectByName("ingredient");
          toast.success("Bechamel añadida");
          setItems(prev => prev.map(i => i.id === "packBechamel" ? { ...i, visible: false } : i));
          setStep(1);
        }
        if (step === 2 && draggedId === pedido.relleno.nombre.toLowerCase()) {
          playEffectByName("ingredient");
          toast.success("¡Ingrediente correcto!");
          setStep(3);
        } else if (step === 2) {
          playEffectByName("wrong");
          toast.warning("Ingrediente incorrecto");
        }
      }
    }

    setDraggedId(null);
  };

  useEffect(() => {
    const onMouseMove = (e) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e) => handleMove(e.touches[0].clientX, e.touches[0].clientY);
    const onMouseUp = () => handleEnd();
    const onTouchEnd = () => handleEnd();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [draggedId, mouseOffset]);

  useEffect(() => {
    if (step === 1) {
      setIsPouring(true);
      milkIntervalRef.current = setInterval(() => {
        setMilkProgress((prev) => {
          if (prev >= 100) {
            clearInterval(milkIntervalRef.current);
            return 100;
          }
          return prev + 1;
        });
      }, 50);
    }
  }, [step]);

  return (
    <div className="bechamel-station">
      <div className="station-content">
        {(step === 0 || step === 2) && (
          <img
            src="/images/bol.png"
            alt="bol"
            ref={bolRef}
            className="position-absolute"
            style={{ width: "20%", left: "65%", top: "55%", transform: "translate(-50%, -50%)" }}
          />
        )}

        {items.map(
          (item) =>
            item.visible && (
              <img
                key={item.id}
                src={`/images/${item.id}.png`}
                alt={item.id}
                style={{
                  position: "absolute",
                  left: item.x,
                  top: item.y,
                  width: "18%",
                  cursor: "grab",
                  userSelect: "none",
                  zIndex: draggedId === item.id ? 10 : 1,
                }}
                onMouseDown={(e) => handleStart(e.clientX, e.clientY, item.id)}
                onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY, item.id)}
              />
            )
        )}

        {step === 1 && (
          <div className="position-absolute w-100 text-center" style={{ top: "20%" }}>
            <img src="/images/milkMinigame.gif" alt="Vertiendo leche" className="animation-img" />
            <div className="progress-wrapper">
              <div style={{ width: "50%", margin: "0 auto" }}><ProgressBar now={milkProgress} variant={milkProgress >= 50 && milkProgress <= 60 ? "success" : "danger"} /></div>
            </div>
            <div className="button-group d-flex justify-content-center gap-3 mt-3">
              <Button
                onClick={() => {
                  playEffectByName("addFlour");
                  clearInterval(milkIntervalRef.current);
                  if (milkProgress >= 35 && milkProgress <= 60) {
                    toast.success("¡Perfecto!");
                  } else {
                    toast.warning("Cantidad incorrecta");
                  }
                  setStep(2);
                }}
              >
                Parar
              </Button>
            </div>
          </div>
        )}

        {step === 2 &&
          ingredientItems.map((item) => (
            <img
              key={item.id}
              src={`/images/${item.id}.png`}
              alt={item.id}
              style={{
                position: "absolute",
                left: item.x,
                top: item.y,
                width: "10%",
                cursor: "grab",
                userSelect: "none",
                zIndex: draggedId === item.id ? 10 : 1,
              }}
              onMouseDown={(e) => handleStart(e.clientX, e.clientY, item.id)}
              onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY, item.id)}
            />
          ))}

        {step === 3 && (
          <div className="position-absolute w-100 text-center" style={{ top: "20%" }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              {isMixing ? (
                <img
                  src="/images/mezclar.gif"
                  alt="Mezclar animación"
                  className="animation-img"
                />
              ) : (
                <img
                  src="/images/mezclar_paused.png"
                  alt="Mezclar en pausa"
                  className="animation-img"
                />
              )}
            </div>

            <div className="progress-wrapper">
              <div style={{ width: "50%", margin: "0 auto" }}><ProgressBar now={mixProgress} variant={mixProgress >= 100 ? "success" : "info"} /></div>
            </div>
            <div className="button-group d-flex justify-content-center gap-3 mt-3">
              <Button
                onClick={() => {
                  playEffectByName("mixing");
                  setIsMixing(true); //gif
                  setMixProgress(prev => Math.min(prev + 10, 100)); //progreso barra
                  setTimeout(() => setIsMixing(false), 1000); //dejamos que la animacion ocurra
                }}

                disabled={mixProgress >= 100}
              >
                Batir
              </Button>
              <Button
                onClick={() => {
                  playEffectByName("ring")
                  toast.success("¡Bechamel listo! Pasa a la siguiente estación.");
                  setFinishedStations((prev) => [...prev, "bechamel"]);
                }}
                disabled={mixProgress < 100}
              >
                Finalizar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BechamelStation;
