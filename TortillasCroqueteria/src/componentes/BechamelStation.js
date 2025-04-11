import React from "react";

function BechamelStation() {
  return (
    <div className="Bechamel-Station">
      <h2>Estación: Bechamel</h2>
      {/* LOS DIV SON PLACEHOLDER PARA LA VERSION ALFA*/}
      <div> {/* Todos los ingredientes en un mismo div */}
      <div
        style={{
          width: '200px',
          height: '100px',
          backgroundColor: 'pink',
          borderRadius: '15px',
          border: '2px solid #000',
        }}
      > 
        Jamon
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
        Pollo
      </div>

      </div>

      <div className="bechamel-station_content">
        {/* Aquí irán los componentes interactivos de la estación */}
        <p>Aquí se hace el bechamel</p>
      </div>
    </div>
  );
}

export default BechamelStation;
