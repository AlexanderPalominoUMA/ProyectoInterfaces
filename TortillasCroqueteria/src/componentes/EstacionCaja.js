import React from "react";
import Button from "./Button";

function Caja({ onComplete }) {
  return (
    <div className="caja-container">
      <h2 className="caja-title">Estación: Caja</h2>
      <p className="caja-description">
        Ola
      </p>

      <Button onClick={onComplete}>Finalizar Juego</Button>
    </div>
  );
}

export default Caja;