import { useState } from "react";
import { useOutletContext } from "react-router";

function EmplatadoStation() {
  const { pedido, setScore, finishedStations, setFinishedStations } = useOutletContext();
  const [croqTablero, setCroqTablero] = useState({
    0: {
      img: '/images/croquetasBien.png',
      enPlato: false
    },
    1: {
      img: '/images/croquetasQuemada.png',
      enPlato: false
    },
    2: {
      img: '/images/croquetaCruda.png',
      enPlato: false
    },
    3: {
      img: '/images/croquetasBien.png',
      enPlato: false
    },
    4: {
      img: '/images/croquetasQuemada.png',
      enPlato: false
    },
    5: {
      img: '/images/croquetaCruda.png',
      enPlato: false
    },
    6: {
      img: '/images/croquetasBien.png',
      enPlato: false
    }
  });

  const [croqPlato, setCroqPlato] = useState({

  });

  return (
    <div
      style={{
        backgroundImage: "url('/images/estacion.png')", // Ruta de la imagen de fondo
        backgroundSize: "cover", // Ajusta la imagen para que quepa completamente sin zoom
        backgroundPosition: "center", // Centra la imagen
        backgroundRepeat: "no-repeat", // Evita la repetición y el reflejo de la imagen
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,

        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >

      <div
        style={{
          position: "relative",
          top: "100px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap"
        }}
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
        style={{
          backgroundImage: "url('/images/tablaMadera.png')",
          backgroundSize: "cover", // Ajusta la imagen para que quepa completamente sin zoom
          backgroundPosition: "center", // Centra la imagen
          backgroundRepeat: "no-repeat", // Evita la repetición y el reflejo de la imagen
          height: "121px",
          width: "207.5px",

          marginRight: "10px",
          marginLeft: "10px",
          marginBottom: "4px",

          paddingTop: "4px",

          display: "grid",
          paddingBottom: "28px",
          paddingLeft: "14px",
          paddingRight: "32px",
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr"
        }}
      >

        {
          Object.entries(croqTablero)
            .filter(([key, value]) => !value.enPlato)
            .map(([key, value]) => (
              <img
                key={key}
                src={value.img}
                style={{
                  position: "relative",
                  width: "36px",
                  cursor: "pointer"
                }}
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
        style={{
          backgroundImage: "url('/images/plato.png')",
          backgroundSize: "cover", // Ajusta la imagen para que quepa completamente sin zoom
          backgroundPosition: "center", // Centra la imagen
          backgroundRepeat: "no-repeat", // Evita la repetición y el reflejo de la imagen
          width: "244.8px",
          height: "144px",
          
          marginBottom: "4px",

          display: "grid",
          paddingTop: "20px",
          paddingBottom: "28px",
          paddingLeft: "32px",
          paddingRight: "32px",
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr"
        }}
      >

        {
          Object.entries(croqPlato)
            .filter(([key, value]) => value.enPlato)
            .map(([key, value]) => (
              <img
                key={key}
                src={value.img}
                style={{
                  width: "36px",
                  height: "50.484px"
                }}
              />
            ))
        }

      </div>
    );
  }

  function renderKetchup() {
    return (
      <div
        style={{
          backgroundImage: "url('/images/ketchup.png')",
          backgroundSize: "cover", // Ajusta la imagen para que quepa completamente sin zoom
          backgroundPosition: "center", // Centra la imagen
          backgroundRepeat: "no-repeat", // Evita la repetición y el reflejo de la imagen

          width: "69px",
          height: "144px",
          marginRight: "10px",
          marginBottom: "4px",
          cursor: "pointer"
        }}

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
        style={{
          backgroundImage: "url('/images/mayonesa.png')",
          backgroundSize: "cover", // Ajusta la imagen para que quepa completamente sin zoom
          backgroundPosition: "center", // Centra la imagen
          backgroundRepeat: "no-repeat", // Evita la repetición y el reflejo de la imagen

          width: "69px",
          height: "144px",
          marginBottom: "4px",
          cursor: "pointer"
        }}

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
        style={{
          backgroundImage: "url('/images/alioli.png')",
          backgroundSize: "cover", // Ajusta la imagen para que quepa completamente sin zoom
          backgroundPosition: "center", // Centra la imagen
          backgroundRepeat: "no-repeat", // Evita la repetición y el reflejo de la imagen

          width: "69px",
          height: "90.66px",
          marginBottom: "-50px",
          cursor: "pointer"
        }}

        onMouseDown={() => {
          const newCroqPlato = { ...croqPlato };
          newCroqPlato["alioli"] = { enPlato: true, img: '/images/alioliPlato.png' }
          setCroqPlato(newCroqPlato);
        }}
      >

      </div>
    );
  }
}




export default EmplatadoStation;
