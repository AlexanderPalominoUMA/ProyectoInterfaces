import "../../styles/FrituraStyle.css";
import { useState, useEffect } from "react";

const fases = ["idle", "aceite", "usando", "listo"];
const cajas = [1, 2];
const maxCroquetas = 5;



function FrituraStation() {
  const [croquetas, setCroquetas] = useState([]);
  const [fasesFreidoras, setFasesFreidoras] = useState(cajas.map(() => 0));
  const [croquetaDentro, setCroquetaDentro] = useState([null, null]);

  useEffect(() => { generarCroquetas(); }, []);

  const renderCroquetas = () =>
    croquetas.map((c) => (
      <img
        key={c.id}
        src="/images/croquetaBechamel.png"
        alt="croqueta"
        className="croqueta-imagen"
        draggable
        onDragStart={(e) => e.dataTransfer.setData("id", c.id)}
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
    cajas.map((_, index) => {
      const fase = fasesFreidoras[index];
      const imagen =
        fase === 0 ? "/images/freidoraIdle.png" : fase === 1 ? "/images/freidoraUsada.png" : "/images/freidoraUsada.png";

      return (
        <div key={`freidora-${index}`} className="freidora-contenedor">
          {fase === 1 && <div className="texto-aceiteCalentando">Calentando el aceite...</div>}
          {fase === 2 && (
            <div className="contenedor-freidora">
              <div className="texto-aceiteListo">Aceite listo para usar</div>
              <img
                src="/images/estadoCroquetaEspacio.png"
                alt="contenedor"
                className="contenedor-freidora-imagen"
              />
              {croquetaDentro[index] && (
                <img
                  src={croquetaDentro[index].imagen}
                  alt="croqueta en freidora"
                  className="croqueta-en-freidora"
                />
              )}
            </div>
          )}
          <img
            src={imagen}
            alt="freidora"
            className="freidora-imagen"
            onClick={() => cambiarAFaseAceite(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const croquetaId = parseInt(e.dataTransfer.getData("id"));
              const croqueta = croquetas.find((c) => c.id === croquetaId);
              if (!croqueta || fasesFreidoras[index] !== 2) return;

              setCroquetaDentro((prev) => {
                const nuevas = [...prev];
                nuevas[index] = {
                  id: croquetaId,
                  estado: "pocohecha",
                  imagen: "/images/croquetaPocoHecha.png"
                };
                return nuevas;
              });
            }}
          />
        </div>
      );
    });

  const cambiarAFaseAceite = (index) => {
    setFasesFreidoras((prev) => {
      const nuevas = [...prev];
      nuevas[index] = 1; // Calentando (cambio de imagen de freidora)
      return nuevas;
    });

    setTimeout(() => {
      setFasesFreidoras((prev) => {
        const nuevas = [...prev];
        nuevas[index] = 2; // Aceita ya caliente (permitir que se agreguen croquetas)
        return nuevas;
      });
    }, 5000); // Tiempo, ahora mismo son 5 segundos
  };

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