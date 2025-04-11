import React, { useState } from "react";
import Button from "./Button";
import StationsNavBar from "./StationsNavBar";
import CashierStation from "./CashierStation";
import BreadingStation from "./BreadingStation";
import GamePauseMenu from "./GamePauseMenu";

function GameStations({ onBackToMenu }) {
  const [activeStation, setActiveStation] = useState("Caja");
  const [pauseMenuVisible, setPauseMenuVisible] = useState(false);

  const renderStation = () => {
    switch (activeStation) {
      case "Caja":
        return <CashierStation />;
      case "Empanado":
        return <BreadingStation />;
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