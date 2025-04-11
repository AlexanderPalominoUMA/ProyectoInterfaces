import React from "react";

function BreadingStation() {
  return (
    <div className="estacion empanado">
      <h2>Estación: Empanado</h2>

      <div className="zona-juego">
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