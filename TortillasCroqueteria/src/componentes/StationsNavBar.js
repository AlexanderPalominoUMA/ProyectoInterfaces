import React from "react";
import Button from "./Button";

function StationNavBar({ onSelectStation }) {
  return (
    <div className="station-nav-bar">
      <Button onClick={() => onSelectStation("Caja")}>Caja</Button>
      <Button onClick={() => onSelectStation("Empanado")}>Empanado</Button>
      {/* Agrega más botones según estaciones */}
    </div>
  );
}

export default StationNavBar;
