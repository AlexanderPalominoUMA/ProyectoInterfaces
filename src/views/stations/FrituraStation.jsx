import "../../styles/FrituraStyle.css";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useOutletContext } from "react-router";
import "react-toastify/dist/ReactToastify.css";

const cajas = [1, 2]; // Número de freidoras que se renderizan
let contadorCroquetasListas = 0;

function FrituraStation() {
  const { pedido, setScore, finishedStations, setFinishedStations } = useOutletContext();
  const [croquetas, setCroquetas] = useState([]);
  const [draggedId, setDraggedId] = useState(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [fasesFreidoras, setFasesFreidoras] = useState(cajas.map(() => 0));
  const [croquetaDentro, setCroquetaDentro] = useState([null, null]);
  const estadosCroqueta = [
    "croquetaBechamel.png",
    "croquetaCruda.png",
    "croquetasBien.png",
    "croquetasQuemada.png"
  ];
  const [croquetasServidas, setCroquetasServidas] = useState([]);
  const maxCroquetas = pedido.cantidad;

  useEffect(() => {
    const guardadas = localStorage.getItem("croquetasListas");
    if (guardadas) {
      try {
        const parsed = JSON.parse(guardadas);
        if (Array.isArray(parsed)) {
          setCroquetasServidas(parsed);
        }
      } catch (e) {
        console.error("Error al parsear croquetasListas:", e);
      }
    }
  }, []);

  useEffect(() => {
  generarCroquetas();
}, [croquetasServidas]);
  

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
        const freidoras = document.querySelectorAll(".freidora-imagen");

        freidoras.forEach((freidora, index) => {
          const rect = freidora.getBoundingClientRect();
          const cx = croqueta.x;
          const cy = croqueta.y;
          if (
            cx > rect.left &&
            cx < rect.right &&
            cy > rect.top &&
            cy < rect.bottom
          ) {
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

            setCroquetas((prev) => prev.filter((c) => c.id !== draggedId)); // Eliminar la croqueta de la lista

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
                id: croqueta.id,
                estadoIndex: 0,
                intervalo,
              };
              return nuevas;
            });
          }
        });

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

  const renderCroquetas = () =>
    croquetas.map((c) => (
      <div
        key={c.id}
        className={`croqueta faseFritura-${c.fase}`}
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
  const generarCroquetas = () => {
    const spacing = window.innerWidth * 0.05;
    const startX = window.innerWidth * 0.005;

    const nuevas = [];
    for (let i = 0; i < maxCroquetas - croquetasServidas.length; i++) {
      nuevas.push({
        id: i + 1,
        fase: 0,
        x: startX + i * spacing,
        y: window.innerHeight * 2 / 3
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
          />
        </div>
      );
    });

  const cambiarAFaseAceite = (index) => {
    if (croquetaDentro[index]) {
      const croqueta = croquetaDentro[index];
      if (croqueta?.intervalo) clearInterval(croqueta.intervalo);

      setCroquetasServidas((prev) => {
        const nuevas = [
          ...prev,
          {
            id: croqueta.id,
            estadoIndex: croqueta.estadoIndex
          },
        ];

        localStorage.setItem("croquetasListas", JSON.stringify(nuevas));
        return nuevas;
      });


      setCroquetaDentro((prev) => {
        const nuevas = [...prev];
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

  const renderCroquetasServidas = () =>
    croquetasServidas.map((c) => (
      <img
        key={`servida-${c.id}`}
        src={`/images/${estadosCroqueta[c.estadoIndex]}`}
        alt={`Croqueta servida estado ${c.estadoIndex}`}
        className="croqueta-servida"
      />
    ));


  return (
    <div className="fritura-station">
      {renderCroquetas()}
      <div className="freidora-wrapper">{renderCajas()}</div>
      <div className="plato-wrapper">{renderCroquetasServidas()}</div>
    </div>
  );
}

export default FrituraStation;