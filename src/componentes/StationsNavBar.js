import React from "react";
import Button from "./Button";

// Se encarga de la barra de navegación entre estaciones en el juego

function StationNavBar({ onSelectStation }) {
  return (
    <div className="station-nav-bar">
      {/* Agrega más botones según estaciones */}
      <Button onClick={() => onSelectStation("Caja")}>Caja</Button>
      <Button onClick={() => onSelectStation("Bechamel")}>Bechamel</Button>
      <Button onClick={() => onSelectStation("Empanado")}>Empanado</Button>
      <Button onClick={() => onSelectStation("Fritura")}>Fritura</Button>
      <Button onClick={() => onSelectStation("Emplatado")}>Emplatado</Button>
    </div>
  );
}

export default StationNavBar;
