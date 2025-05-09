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
        id: croquetas.length + 1,
        fase: 0,
        x: 30 + croquetas.length * 8,
        y: 70
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
        title={`Fase: ${fases[c.fase] || "Listo"}`}
      />
    ));

  const renderCajas = () =>
    fases.map((fase, index) => (
      <><img
        key={fase}
        src={`/images/caja_${fase}.png`}
        alt={`Caja de ${fase}`}
        className="caja-imagen"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          const id = parseInt(e.dataTransfer.getData("id"));
          const croqueta = croquetas.find((c) => c.id === id);
          if (croqueta && croqueta.fase === index) {
            avanzarFase(id);
          }
        }} /><div className="caja-label">{cajaLabels[fase]}</div></>
    ));


  return (
    <div className="empanado-station">
      <div className="contenido-centro">
        <img
          src="/images/bolBechamel.png"
          alt="bol de behcamel"
          className="bolBechamel"
          onClick={generarCroquetas}
        />
        <div className="caja-wrapper">{renderCajas()}</div>
        <div className="croqueta-wrapper">{renderCroquetas()}</div>
      </div>
    </div>
  );
}

export default EmpanadoStation;
