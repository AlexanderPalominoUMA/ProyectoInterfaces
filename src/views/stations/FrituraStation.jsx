import "../../styles/FrituraStyle.css";
import { useState, useEffect } from "react";

const fases = ["idle", "aceite", "usando", "listo"];
const cajas = [1, 2, 3];
const maxCroquetas = 5;



function FrituraStation() {
  const [croquetas, setCroquetas] = useState([]);

  useEffect(() => {generarCroquetas();}, []);
  
  const renderCroquetas = () => 
    croquetas.map((c) => (
    <img
      src="/images/croquetaBechamel.png"
      alt="croqueta"
      className="croqueta-imagen"

    />
  ));
  const generarCroquetas = () => {
    const nuevas = [];
    for (let i = 0; i < maxCroquetas; i++) {
      nuevas.push({
        id: i + 1,
        fase: 0,
        x: 30 + i * 8,
        y: 70
      });
    }
    setCroquetas(nuevas);
  }
  const renderCajas = () =>
    cajas.map((fase, index) => (
      <>
        <img
          src="/images/freidoraIdle.png"
          alt="freidora"
          className="freidora-imagen"
          key={fase}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            /*const id = parseInt(e.dataTransfer.getData("id"));
            const croqueta = croquetas.find((c) => c.id === id);
            if (croqueta && croqueta.fase === index) {
              avanzarFase(id);
            }*/
          }}
        /></>
    ));
    const renderPlato = () => (
      <img
        src="/images/platoServilleta.png"
        alt="plato"
        className="plato-imagen"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          /*const id = parseInt(e.dataTransfer.getData("id"));
          const croqueta = croquetas.find((c) => c.id === id);
          if (croqueta && croqueta.fase === index) {
            avanzarFase(id);
          }*/
        }}
      />
    );
  return (
    <div className="fritura-station">
      <div className="croquetas-wrapper">{renderCroquetas()}</div>
      <div className="freidora-wrapper">{renderCajas()}</div>
      {renderPlato()}
    </div>
  );
}

export default FrituraStation;
