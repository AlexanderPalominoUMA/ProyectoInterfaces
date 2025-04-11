import React, { useState } from "react";
import StationsNavBar from "./StationsNavBar";
import CashierStation from "./CashierStation";
import BreadingStation from "./BreadingStation";

function GameStations() {
  const [activeStation, setActiveStation] = useState("Caja");

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
      {renderStation()}
      <StationsNavBar onSelectStation={setActiveStation} />
    </div>
  );
}

export default GameStations;