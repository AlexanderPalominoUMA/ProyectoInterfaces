import { useState } from "react";
import "../estilos/GameRules.css";
import Button from "./Button";

function GameRules({ onBackToMenu }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [rules] = useState([
    { text: "Regla 1: el pepe", image: "/images/regla1.jpg" },
    { text: "Regla 2: el pepe x2", image: "/images/regla2.jpg" },
    { text: "Regla 3: el pepe x3", image: "/images/regla3.jpg" }
  ]);

  const handleNext = () => {
    if (currentPage < rules.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="game-rules">
      <h2 className="rules-title">Reglas</h2>
      <div className="rule-content">
        <p className="rule-text">{rules[currentPage].text}</p>
        {/* <img src={rules[currentPage].image} alt="Regla" className="rule-image" /> */}
      </div>

      <div className="navigation-buttons">
        <Button onClick={handlePrevious} disabled={currentPage === 0}>
          Anterior
        </Button>
        <Button onClick={handleNext} disabled={currentPage === rules.length - 1}>
          Siguiente
        </Button>
      </div>

      <Button onClick={onBackToMenu} className="back-to-menu">Volver</Button>
    </div>
  );
}

export default GameRules;
