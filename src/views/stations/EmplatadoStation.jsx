import "../../styles/EmplatadoStyle.css";
import { useState } from "react";
import { useOutletContext } from "react-router";

function EmplatadoStation() {
  const [croqTablero, setCroqTablero] = useState(obtenerCroquetas());
  const [croqPlato, setCroqPlato] = useState({});
  const [numCroq, setNumCroq] = useState(0);
  const [salsa, setSalsa] = useState("Ninguno");

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

      <div
        id="emplatado-boton"
        className="emplatado-boton"
      >
        <div
          className="emplatado-boton-texto"
          onMouseDown={() => {
            let emplatado_puntuacion = document.getElementById('emplatado-puntuacion');
            emplatado_puntuacion.style.display = "flex"
            
            let emplatado_boton = document.getElementById('emplatado-boton');
            emplatado_boton.style.display = "none"
          }}
        >
          Entregar
        </div>
      </div>

      <div
        id="emplatado-puntuacion"
        className="emplatado-puntuacion"
      >
        <div
          className="emplatado-puntuacion-titulo"
        >
          Puntuación
        </div>

        <div
          className="emplatado-puntuacion-texto"
        >
          {renderDatos()}
        </div>

        <div
          className="emplatado-puntuacion-boton"
          onMouseDown={() => {
            terminar()
          }}
        >
          Terminar
        </div>
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
                  
                  let newNumCroq = numCroq + 1;
                  setNumCroq(newNumCroq);
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
          newCroqPlato["salsa"] = { enPlato: true, img: '/images/ketchupPlato.png' }
          setCroqPlato(newCroqPlato);
          setSalsa("Ketchup");
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
          newCroqPlato["salsa"] = { enPlato: true, img: '/images/mayonesaPlato.png' }
          setCroqPlato(newCroqPlato);
          setSalsa("Mayonesa");
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
          newCroqPlato["salsa"] = { enPlato: true, img: '/images/alioliPlato.png' }
          setCroqPlato(newCroqPlato);
          setSalsa("Alioli");
        }}
      >

      </div>
    );
  }

  function obtenerCroquetas() {
    let datos = {};
    let croquetasListas = JSON.parse(localStorage.getItem("croquetasListas"));

    if (localStorage.getItem("croquetasListas") === null) {
      croquetasListas = [];
    }

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

  function renderDatos() {
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
              <td>{JSON.parse(localStorage.getItem("pedido"))["cantidad"]}</td>
              <td>{numCroq}</td>
              <td>{calcularPuntuaciones()["puntNumCroquetas"]}</td>
            </tr>
            <tr>
              <td>Salsa</td>
              <td>{JSON.parse(localStorage.getItem("pedido"))["salsa"]}</td>
              <td>{salsa}</td>
              <td>{calcularPuntuaciones()["puntSalsa"]}</td>
            </tr>
            
            { /*
            <tr>
              <td>Relleno</td>
              <td>{JSON.parse(localStorage.getItem("pedido"))["relleno"]["nombre"]}</td>
              <td>Hola {croqPlato.length}</td>
              <td>100</td>
            </tr>
            */}
          </tbody>
        </table>
        <br></br>
        <p
          className="emplatado-puntuacion-total"
        >
          Puntuación total:
          <br></br>
          {
            ((calcularPuntuaciones()["puntNumCroquetas"] + calcularPuntuaciones()["puntSalsa"] + calcularPuntuaciones()["puntRelleno"])/3.0).toFixed(1)
          }
        </p>
      </div>
    );
  }

  function calcularPuntuaciones() {
    let pedido = JSON.parse(localStorage.getItem("pedido"));
    
    let puntNumCroquetas = (numCroq/pedido["cantidad"]) * 100;
    
    let puntSalsa = 0;
    if (pedido["salsa"] == salsa) {
      puntSalsa = 100;
    }

    let puntuaciones = {
      puntNumCroquetas: puntNumCroquetas,
      puntSalsa: puntSalsa,
      puntRelleno: 0
    }

    return puntuaciones;
  }

  function terminar() {
    localStorage.removeItem("croquetasListas");
    localStorage.removeItem("pedido");

    const { id } = useParams();
    const BASE_URL = `/game/${id}`;
    location.href = BASE_URL;
  }
}




export default EmplatadoStation;