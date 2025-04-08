import { useState } from "react";
import { useSound } from "./componentes/SoundContext";
import Loader from "./componentes/Loader";
import MainMenu from "./componentes/MainMenu";
import SettingsMenu from "./componentes/SettingsMenu";
import GameRules from "./componentes/GameRules";
import EstacionCaja from "./componentes/EstacionCaja";
import SaveSlotsMenu from "./componentes/SaveSlotsMenu";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState("menu");
  const [currentSlot, setCurrentSlot] = useState(null);
  const { volume, setVolume, effects, setEffects, music, setMusic } = useSound();

  if (loading) {
    return <Loader onComplete={() => setLoading(false)} />;
  }

  const handleStartFromSlot = (slotIndex) => {
    setCurrentSlot(slotIndex);
    setScreen("game");
  };

  return (
    <div className="App">
      <header className="App-header">
        {screen === "rules" && <GameRules onBackToMenu={() => setScreen("menu")} onComplete={() => setScreen("game")} />}
        {screen === "game" && <EstacionCaja onComplete={() => setScreen("menu")} />}
        {screen === "settings" && <SettingsMenu onBack={() => setScreen("menu")} />}
        {screen === "menu" && (
          <MainMenu
            onNewGame={() => setScreen("saveslots-new")}
            onLoadGame={() => setScreen("saveslots-load")}
            onOpenSettings={() => setScreen("settings")}
            onShowRules={() => setScreen("rules")}
          />
        )}
        {screen === "saveslots-new" && <SaveSlotsMenu mode="new" onBack={() => setScreen("menu")} onSelectSlot={handleStartFromSlot} />}
        {screen === "saveslots-load" && <SaveSlotsMenu mode="load" onBack={() => setScreen("menu")} onSelectSlot={handleStartFromSlot} />}
      </header>
      <audio src="path_to_game_music.mp3" autoPlay loop volume={music / 100} />
    </div>
  );
}

export default App;