import "../../styles/FrituraStyle.css";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const fases = ["idle", "aceite", "usando", "listo"];
const cajas = [1, 2]; // Número de freidoras que se renderizan
const maxCroquetas = 5; // Croquetas que se renderizan, ahora mismo es número fijo y no por pedido



function FrituraStation() {
  const [croquetas, setCroquetas] = useState([]);
  const [fasesFreidoras, setFasesFreidoras] = useState(cajas.map(() => 0));
  const [croquetaDentro, setCroquetaDentro] = useState([null, null]);
  const estadosCroqueta = [
    "croquetaBechamel.png",
    "croquetaCruda.png",
    "croquetasBien.png",
    "croquetasQuemada.png"
  ];

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
              <div className="contenedor-freidora-imagen-wrapper">
                <img
                  src="/images/estadoCroquetaEspacio.png"
                  alt="contenedor"
                  className="contenedor-freidora-imagen"
                />
                {croquetaDentro[index] && (
                  <img
                    src={`/images/${estadosCroqueta[croquetaDentro[index].estadoIndex]}`}
                    alt="croqueta en freidora"
                    className="croqueta-en-freidora"
                  />
                )}
              </div>
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

              if (!croqueta) return;

              if (fasesFreidoras[index] !== 2) {
                toast("Necesitas calentar el aceite! Haz click en la freidora", {
                  position: "top-right",
                  type: "warning",
                });
                return;
              }

              if (croquetaDentro[index]) {
                toast("Ya hay una croqueta en esta freidora", {
                  position: "top-right",
                  type: "info",
                });
                return;
              }

              const intervalo = setInterval(() => {
                setCroquetaDentro((prevInterno) => {
                  const nuevasInterno = [...prevInterno];
                  const actual = nuevasInterno[index];
                  if (!actual) return nuevasInterno;

                  let nuevoIndex = actual.estadoIndex + 1;
                  if (nuevoIndex >= estadosCroqueta.length) {
                    nuevoIndex = estadosCroqueta.length - 1;
                    clearInterval(actual.intervalo);
                  }

                  nuevasInterno[index] = {
                    ...actual,
                    estadoIndex: nuevoIndex,
                    intervalo: actual.intervalo,
                  };
                  return nuevasInterno;
                });
              }, 3000); // TIEMPO PARA CAMBIAR EL ESTADO DE FRITO DE LA CROQUETA

              setCroquetaDentro((prev) => {
                const nuevas = [...prev];
                nuevas[index] = {
                  id: croquetaId,
                  estadoIndex: 0,
                  intervalo,
                };
                return nuevas;
              });
            }}

          />
        </div>
      );
    });

  const cambiarAFaseAceite = (index) => {
    if (croquetaDentro[index]) {
      setCroquetaDentro((prev) => {
        const nuevas = [...prev];
        const croqueta = nuevas[index];

        if (croqueta?.intervalo) clearInterval(croqueta.intervalo);
        nuevas[index] = null;
        return nuevas;
      });

      toast("¡Croqueta servida en el plato!", {
        position: "top-right",
        type: "success",
      });

      return;
    }

    if (fasesFreidoras[index] >= 2) return;

    setFasesFreidoras((prev) => {
      const nuevas = [...prev];
      nuevas[index] = 1;
      return nuevas;
    });

    setTimeout(() => {
      setFasesFreidoras((prev) => {
        if (prev[index] !== 1) return prev;
        const nuevas = [...prev];
        nuevas[index] = 2;
        return nuevas;
      });
    }, 1000); // TIEMPO QUE TARDA EN CALENTARSE EL ACEITE
  };

  // Completar aquí la lógica para servir la croqueta en el plato (ahora mismo no es onDrop, si no cuando haces click en la freidora)
  const renderPlato = () => (
    <img
      src="/images/platoServilleta.png"
      alt="plato"
      className="plato-imagen"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        // Terminar
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