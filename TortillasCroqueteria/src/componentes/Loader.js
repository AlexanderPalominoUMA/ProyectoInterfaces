import { useState, useEffect } from "react";
import "../estilos/Loader.css";

function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {

    // Simulacion de carga de la barra de progreso
    // Comentar y descomentar para su uso

    /*
    // BARRA DE PROGRESO DE 2 SEGUNDOS DE CARGA + 1 SEGUNDO DE ESPERA
    const interval = 50; // Actualizacion cada 50 ms, algo asi como los fps a los que se ve
    const fillDuration = 2000; // Duracion de carga de la barra, 2000ms -> 2 segundos ¿?
    const waitDuration = 1000; // Tiempo de espera cuando la barra este al 100% -> 1 segundos¿?
    const step = (100 / (fillDuration / interval)); // Como aumenta la barra cada vez (paso de 0 a 100)
    */

    // /*
    // SIN BARRA DE PROGRESO
    const interval = 0; // Actualizacion cada 50 ms, algo asi como los fps a los que se ve
    const fillDuration = 0; // Duracion de carga de la barra, 2000ms -> 2 segundos ¿?
    const waitDuration = 0; // Tiempo de espera cuando la barra este al 100% -> 1 segundos¿?
    const step = 0;
    // */

    const timer = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + step;
        return nextProgress >= 100 ? 100 : nextProgress;
      });
    }, interval);

    setTimeout(() => {
      clearInterval(timer);
      setTimeout(onComplete, waitDuration);
    }, fillDuration);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="loader">
      <img src="/images/logo.png"  width="300" className="App-logo" alt="App Logo" />
      <h2>Cargando...</h2>
      <div
        className="progress-bar-container"
        style={{
          width: "30%",
          background: "#ddd",
          borderRadius: "8px",
          overflow: "hidden",
          marginTop: "10px",
        }}
      >
        <div
          className="progress-bar"
          style={{
            width: `${progress}%`,
            height: "10px",
            background: "#4caf50",
            transition: "width 0.05s linear",
          }}
        ></div>
      </div>
    </div>
  );
}

export default Loader;