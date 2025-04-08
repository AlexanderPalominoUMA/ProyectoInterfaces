import Button from "./Button";
import "../estilos/MainMenu.css";

function MainMenu({ onNewGame, onLoadGame, onOpenSettings, onShowRules }) {
  return (
    <div className="main-menu">
      <h1>Tortilla's Croqueteria</h1>
      <div className="menu-buttons">
        <Button onClick={onNewGame}>Nueva Partida</Button>
        <Button onClick={onLoadGame}>Cargar Partida</Button>
        <Button onClick={onOpenSettings}>Ajustes</Button>
        <Button onClick={onShowRules}>Reglas</Button>
      </div>
      <p className="score">Puntuación más alta: </p>
    </div>
  );
}

export default MainMenu;