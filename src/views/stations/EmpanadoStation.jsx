import { useState } from "react";
import "../../styles/EmpanadoStyle.css";
import { toast } from 'react-toastify'; //Para avisos

const maxCroquetas = 5;
const fases = ["harina", "huevo", "pan"];
const cajaLabels = {
  harina: "Harina",
  huevo: "Huevo",
  pan: "Pan Rallado"
};

function EmpanadoStation() {
  const [croquetas, setCroquetas] = useState([]);


  const generarCroquetas = () => {
    if (croquetas.length < maxCroquetas) {
      const nuevaCroqueta = {
        id: Date.now(),
        fase: 0,
        x: 60 + croquetas.length * 80,
        y: 350
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
      <img
        key={c.id}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("id", c.id);
        }}
        src="/images/croquetaBechamel.png"
        alt={`Croqueta fase ${c.fase}`}
        className={`croqueta fase-${c.fase}`}
        style={{ left: `${c.x}px`, top: `${c.y+50}px` }}
        title={`Fase: ${fases[c.fase] || "Listo"}`}
      />
    ));

  const renderCajas = () =>
    fases.map((fase, index) => (
      <div
        key={fase}
        className="caja-wrapper"
        style={{ left: `${ index * 250}px`, top: "115px" }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          const id = parseInt(e.dataTransfer.getData("id"));
          const croqueta = croquetas.find((c) => c.id === id);
          if (croqueta && croqueta.fase === index) {
            avanzarFase(id);
          }
        }}
      >
        <img
          src={`/images/caja_${fase}.png`}
          alt={`Caja de ${fase}`}
          className="caja-imagen"
        />
        <div className="caja-label">{cajaLabels[fase]}</div>
      </div>
    ));

  return (
    <div className="empanado-station">
      <div className="contenido-centro">
      <img src="/images/tablaCortar.png"
        alt="tabla de cortar"
        className="tablaCortar"
      />
      <img
        src="/images/bolBechamel.png"
        alt="bol de behcamel"
        className="bolBechamel"
        onClick={generarCroquetas}
      />
        {renderCajas()}
        {renderCroquetas()}
      </div>
    </div>
  );
}

export default EmpanadoStation;
