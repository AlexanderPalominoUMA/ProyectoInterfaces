import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./views/Home";
import { SoundProvider } from "./providers/SoundProvider";
import Game from "./views/Game";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import BechamelStation from "./views/stations/BechamelStation";
import CajaStation from "./views/stations/CajaStation";
import EmpanadoStation from "./views/stations/EmpanadoStation";
import FrituraStation from "./views/stations/FrituraStation";
import EmplatadoStation from "./views/stations/EmplatadoStation";
import { SettingsProvider } from "./providers/SettingsProvider";
import { ToastContainer } from 'react-toastify';

function App() {
  const isTouchDevice = () => {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  };

  return (
    <>
      <SoundProvider>
        <SettingsProvider>
          <DndProvider backend={isTouchDevice() ? TouchBackend : HTML5Backend}>
            <BrowserRouter>
              <Routes>
                <Route index element={<Home />} />
                <Route path="/game/:id" element={<Game />}>
                  <Route path="" element={<CajaStation />} />
                  <Route path="bechamel" element={<BechamelStation />} />
                  <Route path="empanado" element={<EmpanadoStation />} />
                  <Route path="fritura" element={<FrituraStation />} />
                  <Route path="emplatado" element={<EmplatadoStation />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </DndProvider>
        </SettingsProvider>
      </SoundProvider>
      <ToastContainer />
    </>
  );
}

export default App;
