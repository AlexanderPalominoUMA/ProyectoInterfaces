import React from "react";

function OilStation() {
  return (
    <div className="Oil-Station">
      <h2>Estación: Fritura</h2>

      {/* Placeholder para los ingredientes (aquí puedes poner más divs con diferentes ingredientes) */}
      <div>
        <div
          style={{
            width: '200px',
            height: '100px',
            backgroundColor: 'yellow',
            borderRadius: '15px',
            border: '2px solid #000',
          }}
        > 
          Aceite
        </div>

        <div
          style={{
            width: '200px',
            height: '100px',
            backgroundColor: 'yellow',
            borderRadius: '15px',
            border: '2px solid #000',
          }}
        >
          Aceite
        </div>
      </div>

      <div className="oil-station_content">
        {/* Aquí irán los componentes interactivos de la estación */}
        <p>Aquí se frien cosas</p>
      </div>
    </div>
  );
}

export default OilStation;