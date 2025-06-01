import { Button, Card } from "react-bootstrap";
import { Link } from "react-router";
import { useSound } from "../providers/SoundProvider";

function SaveCard({ id, title, createdAt, puntuacion, refreshSaves }) {
  const { playEffectByName } = useSound();
  let localDate = new Date().toLocaleDateString();
  let dateTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  let saveId = {id, title, dateTime, localDate, puntuacion };


  const guardarPartida = () => {
    if (localStorage.getItem("saveId"+id) === null) {
      localStorage.setItem("saveId"+id, JSON.stringify(saveId));
    }
    localStorage.setItem("currentSaveId", id);
  }

  return (
    <Card>
      <Card.Header>{title}</Card.Header>
      <Card.Body>
        <Card.Text>
          Fecha de creaccion: {createdAt === null ? "-" : createdAt} <br/>
          Puntuacion Total: {localStorage.getItem("saveId"+id) ? puntuacion : "-"} <br/>
        </Card.Text>
        <Button
          as={Link}
          to={`/game/${id}/caja`}
          variant="primary"
          onClick={() => {
            playEffectByName("click");
            localStorage.removeItem("pedido");
            localStorage.removeItem("croquetasListas");
            guardarPartida();
          }}
        >
          {createdAt === null ? "Empezar" : "Continuar"}
        </Button>
        <Button
        hidden={createdAt === null}
        style={{ marginLeft: "5%" }}
        onClick={() => {localStorage.removeItem(`saveId${id}`); 
        playEffectByName("click"); 
        refreshSaves();}}
        >
          Borrar
        </Button>
      </Card.Body>
    </Card>
  );
  
}

export default SaveCard;
