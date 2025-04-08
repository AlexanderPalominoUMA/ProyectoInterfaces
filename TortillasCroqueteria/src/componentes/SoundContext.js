import React, { createContext, useState, useContext } from "react";

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
  const [volume, setVolume] = useState(50);
  const [effects, setEffects] = useState(50);
  const [music, setMusic] = useState(50);

  return (
    <SoundContext.Provider value={{ volume, setVolume, effects, setEffects, music, setMusic }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => useContext(SoundContext);