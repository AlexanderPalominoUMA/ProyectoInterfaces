import "../../styles/EmplatadoStyle.css";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import { useSound } from "../../providers/SoundProvider";

function EmplatadoStation() {
  const { finishedStations, setFinishedStations} = useOutletContext();
  const [croqTablero, setCroqTablero] = useState({});
  const [croqPlato, setCroqPlato] = useState({});
  const [salsa, setSalsa] = useState("Ninguno");
  const currentSaveId = localStorage.getItem("currentSaveId"); 
  const puntuacionActual = JSON.parse(localStorage.getItem("saveId"+currentSaveId)).puntuacion;
  let puntuacionFinal = 0;
  const { playEffectByName, stopEffectByName } = useSound();

  // ① Cargamos las croquetasListas al montar el componente
  useEffect(() => {
    const datos = obtenerCroquetas();
    setCroqTablero(datos);
  }, []);

  return (
    <div className="emplatado-station">
      <div className="emplatado-table">
        {renderAlioli()}
        {renderKetchup()}
        {renderMayonnaise()}
        {renderTablaCroquetas()}
        {renderPlato()}
      </div>

      <div id="emplatado-boton" className="emplatado-boton">
        <div
          className="emplatado-boton-texto"
          onMouseDown={() => {
            playEffectByName("ring")
            const emplatado_puntuacion = document.getElementById(
              "emplatado-puntuacion"
            );
            emplatado_puntuacion.style.display = "flex";

            const emplatado_boton = document.getElementById("emplatado-boton");
            emplatado_boton.style.display = "none";
          }}
        >
          Entregar
        </div>
      </div>

      <div id="emplatado-puntuacion" className="emplatado-puntuacion">
        <div className="emplatado-puntuacion-titulo">Puntuación</div>

        <div className="emplatado-puntuacion-texto">{renderDatos()}</div>

        <div
          className="emplatado-puntuacion-boton"
          onMouseDown={() => {
            playEffectByName("finish");
            terminar();
          }}
        >
          Terminar
        </div>
      </div>
    </div>
  );

  function renderTablaCroquetas() {
    return (
      <div className="emplatado-tabla-madera">
        {Object.entries(croqTablero)
          .filter(([key, value]) => !value.enPlato)
          .map(([key, value]) => (
            <img
              key={key}
              src={value.img}
              className="emplatado-tabla-croqueta"
              alt = "Bandeja donde están las croquetas sacadas de la freidora"
              onMouseDown={() => {
                //Al hacer clic, movemos esa croqueta al plato:
                playEffectByName("ingredient");
                const newCroqTablero = { ...croqTablero };
                const newCroqPlato = { ...croqPlato };

                newCroqPlato[key] = { ...newCroqTablero[key], enPlato: true };
                delete newCroqTablero[key];

                setCroqTablero(newCroqTablero);
                setCroqPlato(newCroqPlato);
              }}
            />
          ))}
      </div>
    );
  }

  function renderPlato() {
    return (
      <div className="emplatado-plato">
        {Object.entries(croqPlato)
          .filter(([key, value]) => value.enPlato)
          .map(([key, value]) => (
            <img
              key={key}
              src={value.img}
              className="emplatado-plato-croqueta"
              alt = {value.alt}
            />
          ))}
      </div>
    );
  }

  function renderKetchup() {
    return (
      <img
        alt = "Bote de salsa ketchup"
        className="emplatado-ketchup"
        src="/images/ketchup.png"
        onMouseDown={() => {
          playEffectByName("sauce");
          const newCroqPlato = { ...croqPlato };
          newCroqPlato["salsa"] = {
            enPlato: true,
            img: "/images/ketchupPlato.png",
            alt: "Pegote de salsa ketchup"
          };
          setCroqPlato(newCroqPlato);
          setSalsa("Ketchup");
        }}
      />
    );
  }

  function renderMayonnaise() {
    return (
      <img
        alt = "Bote de salsa mayonesa"
        className="emplatado-mayonesa"
        src="/images/mayonesa.png"
        onMouseDown={() => {
          playEffectByName("sauce");
          const newCroqPlato = { ...croqPlato };
          newCroqPlato["salsa"] = {
            enPlato: true,
            img: "/images/mayonesaPlato.png",
            alt: "Pegote de salsa mayonesa"
          };
          setCroqPlato(newCroqPlato);
          setSalsa("Mayonesa");
        }}
      />
    );
  }

  function renderAlioli() {
    return (
      <img
        alt = "Bote de salsa alioli"
        className="emplatado-alioli"
        src="/images/alioli.png"
        onMouseDown={() => {
          playEffectByName("sauce");
          const newCroqPlato = { ...croqPlato };
          newCroqPlato["salsa"] = {
            enPlato: true,
            img: "/images/alioliPlato.png",
            alt: "Pegote de salsa alioli"
          };
          setCroqPlato(newCroqPlato);
          setSalsa("Alioli");
        }}
      />
    );
  }

  function obtenerCroquetas() {
    let datos = {};
    let croquetasListas = JSON.parse(localStorage.getItem("croquetasListas"));

    if (croquetasListas === null) {
      croquetasListas = [];
    }

    croquetasListas.forEach((obj) => {
      let img;
      let alt;
      if (obj.estadoIndex === 0) {
        img = "/images/croquetaBechamel.png";
        alt = "Croqueta de bechamel sin rebozar";
      } else if (obj.estadoIndex === 1) {
        img = "/images/croquetaCruda.png";
        alt = "Croqueta cruda";
      } else if (obj.estadoIndex === 2) {
        img = "/images/croquetasBien.png";
        alt = "Croqueta hecha correctamente";
      } else if (obj.estadoIndex === 3) {
        img = "/images/croquetasQuemada.png";
        alt = "Croqueta bien quemada";
      }

      datos[obj.id] = {
        enPlato: false,
        img: img,
        alt: alt,
      };
    });

    return datos;
  }

  function renderDatos() {
    const pedido = JSON.parse(localStorage.getItem("pedido")) || {};

    // ③ Calculamos cuántas croquetas hay en el plato (excluyendo la salsa)
    //    en vez de usar un estado separado:
    const croqEnPlatoCount = Object.entries(croqPlato).filter(
      ([key, value]) => key !== "salsa" && value.enPlato
    ).length;

    puntuacionFinal = (calcularPuntuaciones(croqEnPlatoCount).puntNumCroquetas +
              calcularPuntuaciones(croqEnPlatoCount).puntSalsa) /
            2.0;
    
    

    return (
      <div>
        <table className="emplatado-tabla">
          <thead>
            <tr>
              <td>DESCRIPCIÓN</td>
              <td>PEDIDO</td>
              <td>HECHO</td>
              <td>Puntuación</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Nº de croquetas</td>
              <td>{pedido["cantidad"]}</td>
              <td>{croqEnPlatoCount}</td>
              <td>{calcularPuntuaciones(croqEnPlatoCount).puntNumCroquetas}</td>
            </tr>
            <tr>
              <td>Salsa</td>
              <td>{pedido["salsa"]?.nombre}</td>
              <td>{salsa}</td>
              <td>{calcularPuntuaciones(croqEnPlatoCount).puntSalsa}</td>
            </tr>
            <tr>
              <td>Tiempo de cocción</td>
              <td>{getTiempoCoccionPedidoName()}</td>
              <td>{calcularPuntuaciones(croqEnPlatoCount).cantidadCroquetasCoccionBien} / {JSON.parse(localStorage.getItem('pedido'))["cantidad"]}</td>
              <td>{calcularPuntuaciones(croqEnPlatoCount).puntTiempoFritura}</td>
            </tr>
          </tbody>
        </table>
        <br />
        <p className="emplatado-puntuacion-total">
          Puntuación total:
          <br />
          {puntuacionFinal.toFixed(1)}
        </p>
      </div>
    );
  }

  function calcularPuntuaciones(croqEnPlatoCount) {
    const pedido = JSON.parse(localStorage.getItem("pedido")) || {};

    // ④ Ajustamos el cálculo para usar el número real de croquetas puestas
    const puntNumCroquetas = pedido["cantidad"]
      ? (croqEnPlatoCount / pedido["cantidad"]) * 100
      : 0;

    let puntSalsa = 0;
    if (pedido["salsa"]?.nombre === salsa && salsa !== "Ninguno") {
      puntSalsa = 100;
    }

    let puntTiempoFritura = 0;
    let cantidadCroquetasCoccionBien = 0;
    let coccion = JSON.parse(localStorage.getItem('pedido'))["tiemposcoccion"]["img"];
    coccion = coccion.substring(8, coccion.length - 4);
    
    JSON.parse(localStorage.getItem('croquetasListas')).forEach((croqueta) => {
      let estado = croqueta["estadoIndex"];
      switch (coccion) {
        case "croquetasBien":
          if (estado == 2) {
            puntTiempoFritura += 100;
            cantidadCroquetasCoccionBien++;
          }
          break;
        case "croquetasQuemada":
          if (estado == 3) {
            puntTiempoFritura += 100;
            cantidadCroquetasCoccionBien++;
          }
          break;
        case "croquetaCruda":
          if (estado == 1) {
            puntTiempoFritura += 100;
            cantidadCroquetasCoccionBien++;
          }
      }
    });
    puntTiempoFritura /= JSON.parse(localStorage.getItem('croquetasListas')).length;

    return {
      puntNumCroquetas: puntNumCroquetas,
      puntSalsa: puntSalsa,
      puntTiempoFritura: puntTiempoFritura,
      cantidadCroquetasCoccionBien: cantidadCroquetasCoccionBien
    };
  }

  function terminar() {
    localStorage.removeItem("croquetasListas");
    localStorage.removeItem("pedido");
    let currentSave = JSON.parse(localStorage.getItem("saveId"+currentSaveId));
    currentSave= {
      ...currentSave,
      puntuacion: puntuacionActual + puntuacionFinal
    }

    localStorage.setItem("saveId"+currentSaveId, JSON.stringify(currentSave));


    setFinishedStations((prev) =>
      prev.includes("emplatado") ? prev : [...prev, "emplatado"]
    );

    const currentUrl = window.location.href;
    const regex = /\/game\/([^/]+)\/emplatado/;
    const match = currentUrl.match(regex);

    if (match && match.length > 1) {
      const some_id = match[1];
      window.location.href = `/game/${some_id}/caja`;
    }
  }

  function getTiempoCoccionPedidoName() {
    let tiempoCoccion = JSON.parse(localStorage.getItem('pedido'))["tiemposcoccion"]["nombre"];
    return tiempoCoccion.charAt(0).toUpperCase() + tiempoCoccion.slice(1).toLowerCase();
  }
}

export default EmplatadoStation;
