import React from "react";

function BreadingStation() {
  return (
    <div className="Breading-Station">
      <h2>Estación: Empanado</h2>
      <div> {/* Todos los ingredientes en un mismo div */}
      <div
        style={{
          width: '200px',
          height: '100px',
          backgroundColor: 'white',
          borderRadius: '15px',
          border: '2px solid #000',
        }}
      > 
        Harina
      </div>


      <div
        style={{
          width: '200px',
          height: '100px',
          backgroundColor: 'orange',
          borderRadius: '15px',
          border: '2px solid #000',
        }}
      >
        Huevo
      </div>
      <div
        style={{
          width: '200px',
          height: '100px',
          backgroundColor: 'brown',
          borderRadius: '15px',
          border: '2px solid #000',
        }}
      >
        Pan rallado
      </div>
      </div>
      <div className="breading-station_content">
        {/* Aquí irán los componentes interactivos de la estación */}
        <p>Aquí se empanan cosas</p>
      </div>
    </div>
  );
}

export default BreadingStation;