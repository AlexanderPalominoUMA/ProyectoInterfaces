import React, { useState } from "react";
import Button from "./Button";
import StationsNavBar from "./StationsNavBar";
import CashierStation from "./CashierStation";
import BreadingStation from "./BreadingStation";
import GamePauseMenu from "./GamePauseMenu";
import OilStation from "./OilStation";
import PlatingStation from "./PlatingStation";
import BechamelStation from "./BechamelStation";

function GameStations({ onBackToMenu }) {
  const [activeStation, setActiveStation] = useState("Caja");
  const [pauseMenuVisible, setPauseMenuVisible] = useState(false);


// Redirige a la pantalla de la estación
  const renderStation = () => {
    switch (activeStation) {
      case "Caja":
        return <CashierStation />;
      case "Bechamel":
        return <BechamelStation/>;
      case "Empanado":
        return <BreadingStation />;
      case "Fritura":
        return <OilStation/>;
      case "Emplatado":
        return <PlatingStation/>;
      default:
        return <CashierStation />;
    }
  };

  return (
    <div className="game-stations">
      {/* Botón de pausa */}
      <Button className="pause-button" onClick={() => setPauseMenuVisible(true)}> ☰ </Button>

      {renderStation()}
      <StationsNavBar onSelectStation={setActiveStation} />

      {/* Menú de pausa */}
      {pauseMenuVisible && (
        <GamePauseMenu
          onClose={() => setPauseMenuVisible(false)}
          onOpenSettings={() => {
            setPauseMenuVisible(false);
            onBackToMenu("settings");
          }}
          onReturnToMenu={() => onBackToMenu("menu")}
        />
      )}
    </div>
  );
}

export default GameStations;