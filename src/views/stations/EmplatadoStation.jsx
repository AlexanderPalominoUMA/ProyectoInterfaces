import "../../styles/EmplatadoStyle.css";
import { useState } from "react";
import { useOutletContext } from "react-router";

function EmplatadoStation() {
  const { pedido, setScore, finishedStations, setFinishedStations } = useOutletContext();
  
  const [croqTablero, setCroqTablero] = useState(obtenerCroquetas());

  const [croqPlato, setCroqPlato] = useState({

  });

  return (
    <div
      className="emplatado-station"
    >

      <div
        className="emplatado-table"
      >
        {renderAlioli()}
        {renderKetchup()}
        {renderMayonnaise()}
        {renderTablaCroquetas()}
        {renderPlato()}
      </div>

    </div>
  );

  function renderTablaCroquetas() {

    return (
      <div
        className="emplatado-tabla-madera"
      >

        {
          Object.entries(croqTablero)
            .filter(([key, value]) => !value.enPlato)
            .map(([key, value]) => (
              <img
                key={key}
                src={value.img}
                className="emplatado-tabla-croqueta"
                onMouseDown={() => {
                  const newCroqTablero = { ...croqTablero };
                  const newCroqPlato = { ...croqPlato };

                  newCroqPlato[key] = { ...newCroqTablero[key], enPlato: true }
                  delete newCroqTablero[key];

                  setCroqTablero(newCroqTablero);
                  setCroqPlato(newCroqPlato);
                }}
              />
            ))
        }
      </div>
    );
  }

  function renderPlato() {
    return (
      <div
        className="emplatado-plato"
      >

        {
          Object.entries(croqPlato)
            .filter(([key, value]) => value.enPlato)
            .map(([key, value]) => (
              <img
                key={key}
                src={value.img}
                className="emplatado-plato-croqueta"
              />
            ))
        }

      </div>
    );
  }

  function renderKetchup() {
    return (
      <div
        className="emplatado-ketchup"

        onMouseDown={() => {
          const newCroqPlato = { ...croqPlato };
          newCroqPlato["ketchup"] = { enPlato: true, img: '/images/ketchupPlato.png' }
          setCroqPlato(newCroqPlato);
        }}
      >

      </div>
    );
  }

  function renderMayonnaise() {
    return (
      <div
        className="emplatado-mayonesa"

        onMouseDown={() => {
          const newCroqPlato = { ...croqPlato };
          newCroqPlato["mayonesa"] = { enPlato: true, img: '/images/mayonesaPlato.png' }
          setCroqPlato(newCroqPlato);
        }}
      >

      </div>
    );
  }

  function renderAlioli() {
    return (
      <div
        className="emplatado-alioli"

        onMouseDown={() => {
          const newCroqPlato = { ...croqPlato };
          newCroqPlato["alioli"] = { enPlato: true, img: '/images/alioliPlato.png' }
          setCroqPlato(newCroqPlato);
        }}
      >

      </div>
    );
  }

  function obtenerCroquetas() {
    let datos = {};
    let croquetasListas = JSON.parse(localStorage.getItem("croquetasListas"));

    croquetasListas.forEach(obj => {
      let img;
        if (obj["estadoIndex"] === 1) {
        img = '/images/croquetaCruda.png';
      } else if (obj["estadoIndex"] === 2) {
        img = '/images/croquetasBien.png';
      } else if (obj["estadoIndex"] === 3) {
        img = '/images/croquetasQuemada.png'
      }

      datos[obj["id"]] = {
        enPlato: false,
        img: img
      }
    });

    return datos;
  }
}




export default EmplatadoStation;