import { useState } from "react";
import Loader from "./componentes/Loader";
import MainMenu from "./componentes/MainMenu";
import SettingsMenu from "./componentes/SettingsMenu";
import GameRules from "./componentes/GameRules";
import SaveSlotsMenu from "./componentes/SaveSlotsMenu";
import GameStations from "./componentes/GameStation";

import { Container } from 'react-bootstrap';
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState("menu");
  const [prevScreen, setPrevScreen] = useState(null);
  const [currentSlot, setCurrentSlot] = useState(null);

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
        <Container className="d-flex flex-column justify-content-center align-items-center">
          {screen === "rules" && <GameRules onBackToMenu={() => setScreen("menu")} onComplete={() => setScreen("game")} />}
          {screen === "game" && (
            <GameStations
              onBackToMenu={(newScreen) => {
                setPrevScreen("game");
                setScreen(newScreen);
              }}
            />
          )}
          {screen === "settings" && (
            <SettingsMenu
              onBack={() => {
                if (prevScreen) {
                  setScreen(prevScreen);
                  setPrevScreen(null);
                } else {
                  setScreen("menu");
                }
              }}
            />
          )}
          {screen === "menu" && (
            <MainMenu
              onNewGame={() => setScreen("saveslots-new")}
              onLoadGame={() => setScreen("saveslots-load")}
              onOpenSettings={() => {
                setPrevScreen(screen);
                setScreen("settings");
              }}
              onShowRules={() => setScreen("rules")}
            />
          )}
          {screen === "saveslots-new" && <SaveSlotsMenu mode="new" onBack={() => setScreen("menu")} onSelectSlot={handleStartFromSlot} />}
          {screen === "saveslots-load" && <SaveSlotsMenu mode="load" onBack={() => setScreen("menu")} onSelectSlot={handleStartFromSlot} />}
        </Container>
      </header>
    </div>
  );
}

export default App;
