import React, { createContext, useState, useContext, useEffect } from "react";

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
  const [volume, setVolume] = useState(50);
  const [effects, setEffects] = useState(50);
  const [music, setMusic] = useState(50);
  const [musicAudio] = useState(() => new Audio("/assets/music/menu.mp3"));

  useEffect(() => {
    musicAudio.loop = true;
    musicAudio.volume = music / 100;

    const tryPlay = () => {
      musicAudio.play().catch((e) => {
        console.log("Autoplay bloqueado incluso tras interacción:", e);
      });
      document.removeEventListener("click", tryPlay);
    };

    musicAudio.play().catch(() => {
      document.addEventListener("click", tryPlay);
    });

    return () => {
      document.removeEventListener("click", tryPlay);
    };
  }, [musicAudio]);

  useEffect(() => {
    musicAudio.volume = music / 100;
  }, [music, musicAudio]);

  return (
    <SoundContext.Provider value={{ volume, setVolume, effects, setEffects, music, setMusic }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => useContext(SoundContext);