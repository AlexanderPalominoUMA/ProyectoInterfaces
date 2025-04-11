import React, { useState } from "react";

// Componente para el minijuego de destreza
function DestrezaGame({ onGameSuccess }) {
  const [isRunning, setIsRunning] = useState(false);
  const [position, setPosition] = useState(0);
  const [inGreenZone, setInGreenZone] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [showMessage, setShowMessage] = useState(false); // Estado para controlar la visualización del mensaje
  const [errorMessage, setErrorMessage] = useState(false); // Estado para el mensaje de error
  const greenZoneStart = 40;
  const greenZoneEnd = 60;
  let milk;

  const handleStartGame = () => {
    setIsRunning(true);
    setPosition(0);
    setInGreenZone(false);
    setGameFinished(false);
    setShowMessage(false); // Resetear el mensaje al comenzar el juego
    setErrorMessage(false); // Resetear el mensaje de error al comenzar el juego
    moveBar();
  };

  const handleClickButton = () => {
    if (position >= greenZoneStart && position <= greenZoneEnd) {
      setInGreenZone(true);
      onGameSuccess();
      milk = true;
      setGameFinished(true);
      setShowMessage(true); // Mostrar el mensaje cuando el juego termina correctamente
      setTimeout(() => {
        setShowMessage(false); // Ocultar el mensaje después de 2.5 segundos
      }, 2500); // 2500 = 2.5 segundos
    } else {
        setErrorMessage(true);
        setTimeout(() => {
            setErrorMessage(false); // Ocultar el mensaje de error después de 2 segundos
          }, 2000); // 2000ms = 2 segundos // Mostrar el mensaje de error si está fuera de la zona verde
      }
  };

  const moveBar = () => {
    const interval = setInterval(() => {
      setPosition((prevPosition) => {
        const newPosition = prevPosition + 1;
        if (newPosition > 100 && !milk) {
          setPosition(0);
        }
        return newPosition;
      });
    }, 50);
  };

  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      <button onClick={handleStartGame} hidden={isRunning}>
        Añadir leche
      </button>
      {!gameFinished && (
        <div style={{ width: "100%", height: "20px", backgroundColor: "#ddd", marginTop: "20px", position: "relative" }}>
          <div
            style={{
              width: `${position}%`,
              height: "100%",
              backgroundColor: position >= greenZoneStart && position <= greenZoneEnd ? "green" : "red",
              transition: "width 0.05s linear",
            }}
          />
        </div>
      )}
      {isRunning && <button onClick={handleClickButton} hidden={gameFinished}>Go</button>}
      
      {/* Mostrar el mensaje solo si el juego ha terminado correctamente y showMessage es true */}
      {gameFinished && showMessage && <p>¡Perfecto! Acertaste a la zona verde.</p>}
      
      {errorMessage && <p> Intenta de nuevo.</p>}
    </div>
  );
}

// Componente principal para la estación Bechamel
function BechamelStation() {
  const [showMilk, setShowMilk] = useState(true);
  const [ingredient, setIngredient] = useState(""); // Estado para almacenar la elección de ingrediente
  const [message, setMessage] = useState(""); // Estado para el mensaje de éxito o fallo
  const [progress, setProgress] = useState(0); // Estado para el progreso de la barra de batido
  const [isBeaten, setIsBeaten] = useState(false); // Estado para indicar si los ingredientes han sido batidos
  const [showBeatButton, setShowBeatButton] = useState(false); // Estado para controlar la visibilidad del botón de batir
  const [showIngredients, setShowIngredients] = useState(true); // Estado para controlar la visibilidad de los ingredientes


  const handleGameSuccess = () => {
    setShowMilk(false);
    setIngredient("pollo"); // O puedes usar "jamon" o "pollo" al azar
    setShowIngredients(true); // Mostrar los ingredientes cuando el juego termina
  };

  const handleDrop = (e, correctIngredient) => {
    e.preventDefault();
    const draggedItem = e.dataTransfer.getData("ingredient");
    if (draggedItem === correctIngredient) {
      setMessage("¡Correcto! Has añadido el ingrediente correcto.");
      setShowBeatButton(true); // Mostrar el botón de batir cuando el ingrediente se haya añadido correctamente
      setShowIngredients(false); // Esconder los ingredientes cuando se haya añadido el correcto
    } else {
      setMessage("¡Incorrecto! Intenta con el ingrediente correcto.");
    }

    // Después de 2.5 segundos, ocultar el mensaje
    setTimeout(() => {
      setMessage(""); // Eliminar el mensaje después de 2.5 segundos
    }, 2500); // 2500ms = 2.5 segundos
  };

  const handleDragStart = (e, ingredientName) => {
    e.dataTransfer.setData("ingredient", ingredientName);
  };

  // Función para simular el batido de ingredientes con clics
  const handleBeatIngredients = () => {
    if (isBeaten) return; // No permitir más batidos si ya está batido
    setProgress((prevProgress) => {
      const newProgress = prevProgress + 10;
      if (newProgress >= 100) {
        setProgress(100);
        setIsBeaten(true); // Los ingredientes se han batido completamente
      }
      return newProgress;
    });
  };

  return (
    <div className="Bechamel-Station">
      <h2>Estación: Bechamel</h2>

      <div>
        <img
          src="/images/tacos-jamon.png"
          alt="Jamon"
          style={{ width: "200px", height: "auto", cursor: "pointer", display: showIngredients ? "block" : "none" }} // Mostrar si showIngredients es true
          draggable
          onDragStart={(e) => handleDragStart(e, "jamon")}
        />
        <img
          src="/images/pollo.png"
          alt="Pollo"
          style={{ width: "200px", height: "auto", cursor: "pointer", display: showIngredients ? "block" : "none" }} // Mostrar si showIngredients es true
          draggable
          onDragStart={(e) => handleDragStart(e, "pollo")}
        />
      </div>

      <div className="bechamel-station_content" style={{ textAlign: "center" }}>
        <img
          src="/images/bol.png"
          alt="Bechamel"
          style={{ width: "200px", height: "auto", border: "2px dashed #000", marginTop: "20px" }}
          onDrop={(e) => handleDrop(e, ingredient)}
          onDragOver={(e) => e.preventDefault()}
        />

        {/* Mostrar el brick de leche solo si showMilk es true */}
        {showMilk && (
            <img
              src="/images/leche.png"
              alt="Brick de Leche"
              style={{ width: "150px", height: "auto", marginTop: "20px" }}
            />
        )}

        {/* Componente del minijuego de destreza */}
        <DestrezaGame onGameSuccess={handleGameSuccess} />

        {/* Mostrar el mensaje de éxito o fallo */}
        {message && <p>{message}</p>}

      {/* Barra de progreso para batir los ingredientes */}
      <div style={{ width: "100%", height: "20px", backgroundColor: "#ddd", marginTop: "20px" }}>
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              backgroundColor: "green",
              transition: "width 0.2s linear",
            }}
          />
        </div>        

        {/* Botón para comenzar el minijuego de batir */}
        {showBeatButton && !isBeaten && (
          <button onClick={handleBeatIngredients}>Batir</button>
        )}

        {/* Mensaje de felicitación cuando la barra se llena */}
        {isBeaten && <p>¡Enhorabuena! Los ingredientes han sido batidos correctamente.</p>}     

      </div>
    </div>
  );
}

export default BechamelStation;
