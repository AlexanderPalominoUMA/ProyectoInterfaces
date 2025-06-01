import { createContext, useState, useContext, useEffect } from "react";

const SoundContext = createContext();
const musicVolume = localStorage.getItem("musicVolume")? localStorage.getItem("musicVolume") : 10;
const effectsVolume = localStorage.getItem("effectsVolume")? localStorage.getItem("effectsVolume") : 50;

export const SoundProvider = ({ children }) => {
  const [volume, setVolume] = useState(50);
  const [effects, setEffects] = useState(effectsVolume);
  const [music, setMusic] = useState(musicVolume);
  const [musicSrc, setMusicSrc] = useState(0);
  const [musicAudio, setMusicAudio] = useState(() => { // Musica global de fondo (ajustable con slider de música)
    const audio = new Audio("/assets/music/menu.mp3");
    audio.loop = true;
    return audio;
  });
  
  const soundEffectMap = { // Mapa con todos los efectos de sonido (ajustable con slider de efectos)
    click: "/assets/effectSounds/BotonMenuSound.mp3",
    newClient: "/assets/effectSounds/newClient.wav",
    addFlour: "/assets/effectSounds/flour.wav",
    ingredient: "/assets/effectSounds/ingredient.mp3",
    mixing: "/assets/effectSounds/mixing.mp3",
    wrong: "/assets/effectSounds/wrong.wav",
    ring: "/assets/effectSounds/ring.mp3",
    harina: "/assets/effectSounds/harina.wav",
    huevo: "/assets/effectSounds/huevo.wav",
    pan: "/assets/effectSounds/pan.wav",
    encenderFreidora: "/assets/effectSounds/EncenderFreidoraSound.mp3",
    freir: "/assets/effectSounds/FreirSound.mp3",
    sauce: "/assets/effectSounds/sauce.wav",
    finish: "/assets/effectSounds/TerminarEmplatadoDineroSound.mp3",
  };
  const [activeEffects, setActiveEffects] = useState({});


  useEffect(() => { //funcionamiento de la musica de fondo
    // Detener música anterior
    musicAudio.pause();
    musicAudio.currentTime = 0;

    // Crear nuevo audio y reproducirlo
    const newAudio = new Audio(musicSrc);
    newAudio.loop = true;
    newAudio.volume = music / 100;

    const tryPlay = () => {
      newAudio.play().catch((e) => {
        console.log("Autoplay bloqueado incluso tras interacción:", e);
      });
      document.removeEventListener("click", tryPlay);
    };

    newAudio.play().catch(() => {
      document.addEventListener("click", tryPlay);
    });

    setMusicAudio(newAudio);

    return () => {
      document.removeEventListener("click", tryPlay);
      newAudio.pause();
      newAudio.currentTime = 0;
    };
  }, [musicSrc], [musicAudio]);

  useEffect(() => {
    musicAudio.volume = music / 100;
  }, [music, musicAudio]);

  const playEffectByName = (name) => {
    const src = soundEffectMap[name];
    if (src) {
      const audio = new Audio(src);
      audio.volume = effects / 100;
      audio.loop = name === "freir";
      audio.play();

      if (name === "freir") {
        setActiveEffects((prev) => {
          const actuales = prev["freir"] || [];

          // Limitar a máximo 2 sonidos de freír activos
          if (actuales.length >= 2) return prev;

          return {
            ...prev,
            freir: [...actuales, audio],
          };
        });
      }

    } else {
      console.warn(`Efecto de sonido "${name}" no encontrado`);
    }
  };


  const stopEffectByName = (name) => {
    const efecto = activeEffects[name];

    if (Array.isArray(efecto)) {
      efecto.forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
    } else if (efecto) {
      efecto.pause();
      efecto.currentTime = 0;
    }

    setActiveEffects((prev) => {
      const nuevo = { ...prev };
      delete nuevo[name];
      return nuevo;
    });
  };



  const playEffect = (src) => {
    const audio = new Audio(src);
    audio.volume = effects / 100;
    audio.play();
  };

  const stopAllEffects = () => {
    Object.values(activeEffects).forEach((audio) => {
      if (Array.isArray(audio)) {
        audio.forEach((a) => {
          a.pause();
          a.currentTime = 0;
        });
      } else {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    setActiveEffects({});
  };



  return (
    <SoundContext.Provider
      value={{ volume, setVolume, effects, setEffects, music, setMusic, playEffect, playEffectByName, stopEffectByName, setMusicSrc, stopAllEffects }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => useContext(SoundContext);
