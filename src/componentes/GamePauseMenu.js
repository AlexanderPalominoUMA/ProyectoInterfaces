import React from "react";
import Button from "./Button";
import "../estilos/GamePauseMenu.css";

export default function GamePauseMenu({ onClose, onOpenSettings, onReturnToMenu }) {
  return (
    <div className="pause-menu-overlay">
      <div className="pause-menu">
        <h2>Menú de Pausa</h2>
        <Button className="btn-menu" onClick={onOpenSettings}>Ajustes</Button>
        <Button className="btn-menu" onClick={onClose}>Volver al juego</Button>
        <Button className="btn-menu" onClick={onReturnToMenu}>Guardar y salir</Button>
      </div>
    </div>
  );
}