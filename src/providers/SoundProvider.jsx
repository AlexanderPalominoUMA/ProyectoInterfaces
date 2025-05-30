import React, { createContext, useState, useContext, useEffect } from "react";

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
  const [volume, setVolume] = useState(50);
  const [effects, setEffects] = useState(50);
  const [music, setMusic] = useState(0);
  const [musicAudio] = useState(() => new Audio("/assets/music/menu.mp3")); // Musica global de fondo (ajustable con slider de música)
  const soundEffectMap = { // Mapa con todos los efectos de sonido (ajustable con slider de efectos)
    click: "/assets/effectSounds/BotonMenuSound.mp3",
  };

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

  const playEffectByName = (name) => { // Llamamos aqui para buscar el efecto por nombre y llamar  a playEffect
    const src = soundEffectMap[name];
    if (src) {
      playEffect(src);
    } else {
      console.warn(`Efecto de sonido "${name}" no encontrado`);
    }
  };
  const playEffect = (src) => {
    const audio = new Audio(src);
    audio.volume = effects / 100;
    audio.play();
  };

  return (
    <SoundContext.Provider
      value={{ volume, setVolume, effects, setEffects, music, setMusic, playEffect, playEffectByName }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => useContext(SoundContext);
