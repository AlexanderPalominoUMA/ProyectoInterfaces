import { createContext, useContext, useState } from 'react';
import SettingsModal from '../views/modals/SettingsModal';

const SettingsContext = createContext();

export const useSettings = () => {
  return useContext(SettingsContext);
};

export const SettingsProvider = ({ children }) => {
  const [show, setShow] = useState(false);

  const openSettings = () => {
    setShow(true);
  };

  const closeSettings = () => {
    setShow(false);
  };

  return (
    <SettingsContext.Provider value={{ openSettings, closeSettings }}>
      {children}
      <SettingsModal show={show} close={closeSettings} />
    </SettingsContext.Provider>
  );
};
