import { useEffect, useState, useRef } from "react";
import "../../styles/EmpanadoStyle.css";
import { toast } from 'react-toastify';
import { useOutletContext } from "react-router";

let contadorCroquetasListas = 0;
const fases = ["harina", "huevo", "pan"];
const cajaLabels = {
  harina: "Harina",
  huevo: "Huevo",
  pan: "Pan Rallado"
};

function EmpanadoStation() {
  const bolRef = useRef(null);
  const [croquetas, setCroquetas] = useState([]);
  const [draggedId, setDraggedId] = useState(null);
  const { pedido, setScore, finishedStations, setFinishedStations } = useOutletContext();
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const maxCroquetas = pedido.cantidad;

  const generarCroquetas = () => {
    if (croquetas.length < maxCroquetas && bolRef.current && contadorCroquetasListas+croquetas.length < maxCroquetas) {
      const bolRect = bolRef.current.getBoundingClientRect();
      const spacing = window.innerWidth * 0.05;

      const nuevaCroqueta = {
        id: croquetas.length + 1,
        fase: 0,
        x: bolRect.right + (bolRect.width / 2) - ((maxCroquetas - 1) * spacing) / 3.5 + croquetas.length * spacing,
        y: bolRect.top + (bolRect.height / 2)
      };

      setCroquetas((prev) => [...prev, nuevaCroqueta]);
    } else {
      toast("Ooops... No más.", {
        position: "top-right",
        type: "warning",
      });
    }
  };

  const avanzarFase = (id) => {
    setCroquetas((prev) =>
      prev.map((c) =>
        c.id === id && c.fase < fases.length
          ? { ...c, fase: c.fase + 1 }
          : c
      )
    );
  };

  const renderCroquetas = () =>
    croquetas.map((c) => (
      <div
        key={c.id}
        className={`croqueta fase-${c.fase}`}
        style={{
          position: "absolute",
          left: `${c.x}px`,
          top: `${c.y}px`,
          zIndex: draggedId === c.id ? 10 : 1,
        }}
        onMouseDown={(e) => handleStart(e.clientX, e.clientY, c.id)}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          handleStart(touch.clientX, touch.clientY, c.id);
        }}
      >
        <img
          src="/images/croquetaBechamel.png"
          alt={`Croqueta fase ${c.fase}`}
          style={{ width: "80%", height: "auto" }}
        />
      </div>
    ));

  const renderCajas = () =>
    fases.map((fase, index) => (
      <div key={fase} className="caja-wrapper">
        <img
          src={`/images/caja_${fase}.png`}
          alt={`Caja de ${fase}`}
          className="caja-imagen"
          data-fase={index}
        />
        <div className="caja-label">{cajaLabels[fase]}</div>
      </div>
    ));

  useEffect(() => {
    const handleMove = (e) => {
      let clientX, clientY;
      if (e.touches) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      if (draggedId !== null) {
        setCroquetas((prev) =>
          prev.map((c) =>
            c.id === draggedId
              ? {
                ...c,
                x: clientX - mouseOffset.x,
                y: clientY - mouseOffset.y,
              }
              : c
          )
        );
      }
    };

    const handleEnd = () => {

      if (draggedId !== null) {
        const croqueta = croquetas.find((c) => c.id === draggedId);
        const cajas = document.querySelectorAll(".caja-imagen");
        const finalizado = document.getElementById("finalizado");

        cajas.forEach((caja, index) => {
          const rect = caja.getBoundingClientRect();
          const cx = croqueta.x;
          const cy = croqueta.y;
          if (
            cx > rect.left &&
            cx < rect.right &&
            cy > rect.top &&
            cy < rect.bottom &&
            croqueta.fase === index
          ) {
            avanzarFase(croqueta.id);
          }
        });

        const rect = finalizado.getBoundingClientRect();
        const cx = croqueta.x;
        const cy = croqueta.y;
        if (
          cx > rect.left &&
          cx < rect.right &&
          cy > rect.top &&
          cy < rect.bottom &&
          croqueta.fase === fases.length
        ) {
          contadorCroquetasListas++;
          setCroquetas((prev) => prev.filter((c) => c.id !== draggedId));
          if (contadorCroquetasListas === maxCroquetas) {
            toast("Croquetas listas para freír!", {
              position: "top-right",
              type: "success",
            });
          }
        }

        setDraggedId(null);
      }
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [draggedId, mouseOffset, croquetas]);

  const handleStart = (x, y, id) => {
    setDraggedId(id);
    const croqueta = croquetas.find((c) => c.id === id);
    if (croqueta) {
      setMouseOffset({ x: x - croqueta.x, y: y - croqueta.y });
    }
  };

  return (
    <div className="empanado-station">
      <div className="contenido-centro">
        <img
          src="/images/bolBechamel.png"
          alt="bol de bechamel"
          className="bolBechamel"
          onClick={generarCroquetas}
          ref={bolRef}
        />
        {renderCajas()}
        {renderCroquetas()}
        <div id="finalizado" className="caja-imagen" data-fase={fases.length}></div>
        <div className="contador-croquetasFinalizadas" style={{ color: contadorCroquetasListas === maxCroquetas ? "green" : "black" }}        >{contadorCroquetasListas+"/"+ maxCroquetas}</div>
      </div>
    </div>
  );
}

export default EmpanadoStation;