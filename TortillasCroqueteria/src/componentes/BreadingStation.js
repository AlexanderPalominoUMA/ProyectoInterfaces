import React from "react";

function BreadingStation() {
  return (
    <div className="Breading-Station">
      <h2>Estación: Empanado</h2>

      <div className="breading-station_content">
        {/* Aquí irán los componentes interactivos de la estación */}
        <p>Aquí se empanan cosas</p>
      </div>

      <div className="lista-pedido">
        <h3>Pedido actual</h3>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </div>
    </div>
  );
}

export default BreadingStation;