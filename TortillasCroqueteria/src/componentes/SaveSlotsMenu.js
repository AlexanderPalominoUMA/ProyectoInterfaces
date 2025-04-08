import "../estilos/SaveSlotsMenu.css";
import Button from "./Button";

function SaveSlotsMenu({ mode, onSelectSlot, onBack }) {
  const slots = [1, 2, 3];

  const getSlotData = (slot) => {
    const data = localStorage.getItem(`saveSlot${slot}`);
    return data ? JSON.parse(data) : null;
  };

  const handleNewGame = (slot) => {
    const newSave = {
      timestamp: Date.now(),
      progreso: {}
    };
    localStorage.setItem(`saveSlot${slot}`, JSON.stringify(newSave));
    onSelectSlot(slot);
  };

  const handleLoadGame = (slot) => {
    const data = getSlotData(slot);
    if (data) {
      onSelectSlot(slot);
    } else {
      alert("Este espacio está vacío.");
    }
  };

  const handleDelete = (slot) => {
    if (window.confirm("¿Seguro que quieres borrar esta partida?")) {
      localStorage.removeItem(`saveSlot${slot}`);
    }
  };

  return (
    <div className="save-slots-menu">
      <h2>{mode === "load" ? "Cargar Partida" : "Nueva Partida"}</h2>
      <div className="slots">
        {slots.map((slot) => {
          const data = getSlotData(slot);
          return (
            <div key={slot} className="slot-card">
              <h3>Espacio {slot}</h3>
              {data ? (
                <>
                  <p>{data.nombre}</p>
                  <p>{new Date(data.timestamp).toLocaleString()}</p>
                  {mode === "load" ? (
                    <>
                      <Button onClick={() => handleLoadGame(slot)}>Jugar</Button>
                      <Button onClick={() => handleDelete(slot)}>Eliminar</Button>
                    </>
                  ) : (
                    <Button onClick={() => handleNewGame(slot)}>Volver a Empezar</Button>
                  )}
                </>
              ) : (
                mode === "new" && <Button onClick={() => handleNewGame(slot)}>Crear nueva</Button>
              )}
            </div>
          );
        })}
      </div>
      <Button className="back-button" onClick={onBack}>Volver</Button>
    </div>
  );
}

export default SaveSlotsMenu;