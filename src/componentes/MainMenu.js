import Button from "./Button";
import "../estilos/MainMenu.css";

function MainMenu({ onNewGame, onLoadGame, onOpenSettings, onShowRules }) {
  return (
    <div className="main-menu">
      <h1 className="title">Tortilla's Croqueteria</h1>
      <div className="menu-buttons">
        <Button className="menu-button" onClick={onNewGame}>Nueva Partida</Button>
        <Button className="menu-button" onClick={onLoadGame}>Cargar Partida</Button>
        <Button className="menu-button" onClick={onOpenSettings}>Ajustes</Button>
        <Button className="menu-button" onClick={onShowRules}>Reglas</Button>
      </div>
      <p className="score">Puntuación más alta: </p>
    </div>
  );
}

export default MainMenu;