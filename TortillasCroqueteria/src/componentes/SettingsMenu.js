import { useSound } from "./SoundContext";
import Button from "./Button";
import "../estilos/SettingsMenu.css";

function SettingsMenu({ onBack }) {
  const { volume, setVolume, effects, setEffects, music, setMusic } = useSound();

  return (
    <div className="settings-card">
      <h2 className="settings-title">Ajustes</h2>

      <div className="settings-group">
        <label>Volumen de Efectos</label>
        <input
          type="range"
          min="0"
          max="100"
          value={effects}
          onChange={(e) => setEffects(e.target.value)}
        />
      </div>

      <div className="settings-group">
        <label>Volumen de Música</label>
        <input
          type="range"
          min="0"
          max="100"
          value={music}
          onChange={(e) => setMusic(e.target.value)}
        />
      </div>

      <Button className="back-to-menu" onClick={onBack}>Volver</Button>

      <img
        src={"/images/settings.svg"}
        className="settings-button-img"
        alt="settingsButton"
      />
    </div>
  );
}

export default SettingsMenu;
