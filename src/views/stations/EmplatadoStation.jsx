import "../../styles/EmplatadoStyle.css";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";

function EmplatadoStation() {
  const { finishedStations, setFinishedStations } = useOutletContext();
  const [croqTablero, setCroqTablero] = useState({});
  const [croqPlato, setCroqPlato] = useState({});
  const [salsa, setSalsa] = useState("Ninguno");

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
              onMouseDown={() => {
                // ② Al hacer clic, movemos esa croqueta al plato:
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
            />
          ))}
      </div>
    );
  }

  function renderKetchup() {
    return (
      <div
        className="emplatado-ketchup"
        onMouseDown={() => {
          const newCroqPlato = { ...croqPlato };
          newCroqPlato["salsa"] = {
            enPlato: true,
            img: "/images/ketchupPlato.png",
          };
          setCroqPlato(newCroqPlato);
          setSalsa("Ketchup");
        }}
      />
    );
  }

  function renderMayonnaise() {
    return (
      <div
        className="emplatado-mayonesa"
        onMouseDown={() => {
          const newCroqPlato = { ...croqPlato };
          newCroqPlato["salsa"] = {
            enPlato: true,
            img: "/images/mayonesaPlato.png",
          };
          setCroqPlato(newCroqPlato);
          setSalsa("Mayonesa");
        }}
      />
    );
  }

  function renderAlioli() {
    return (
      <div
        className="emplatado-alioli"
        onMouseDown={() => {
          const newCroqPlato = { ...croqPlato };
          newCroqPlato["salsa"] = {
            enPlato: true,
            img: "/images/alioliPlato.png",
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
      if (obj.estadoIndex === 0) {
        img = "/images/croquetaBechamel.png";
      } else if (obj.estadoIndex === 1) {
        img = "/images/croquetaCruda.png";
      } else if (obj.estadoIndex === 2) {
        img = "/images/croquetasBien.png";
      } else if (obj.estadoIndex === 3) {
        img = "/images/croquetasQuemada.png";
      }

      datos[obj.id] = {
        enPlato: false,
        img: img,
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
          </tbody>
        </table>
        <br />
        <p className="emplatado-puntuacion-total">
          Puntuación total:
          <br />
          {(
            (calcularPuntuaciones(croqEnPlatoCount).puntNumCroquetas +
              calcularPuntuaciones(croqEnPlatoCount).puntSalsa) /
            2.0
          ).toFixed(1)}
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

    return {
      puntNumCroquetas: puntNumCroquetas,
      puntSalsa: puntSalsa,
    };
  }

  function terminar() {
    localStorage.removeItem("croquetasListas");
    localStorage.removeItem("pedido");

    setFinishedStations((prev) =>
      prev.includes("emplatado") ? prev : [...prev, "emplatado"]
    );

    const currentUrl = window.location.href;
    const regex = /\/game\/([^/]+)\/emplatado/;
    const match = currentUrl.match(regex);

    if (match && match.length > 1) {
      const some_id = match[1];
      window.location.href = `/game/${some_id}`;
    }
  }
}

export default EmplatadoStation;
