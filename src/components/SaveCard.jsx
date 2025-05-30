import { Button, Card } from "react-bootstrap";
import { Link } from "react-router";
import { useSound } from "../providers/SoundProvider";

function SaveCard({ id, title, createdAt, puntuacion, refreshSaves }) {
  const { playEffectByName } = useSound();
  let localDate = new Date().toLocaleDateString();
  let dateTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  let saveId = {id, title, dateTime,localDate };


  return (
    <Card>
      <Card.Header>{title}</Card.Header>
      <Card.Body>
        <Card.Text>
          Fecha de creaccion: {createdAt === null ? "-" : createdAt}
        </Card.Text>
        <Button
          as={Link}
          to={`/game/${id}`}
          variant="primary"
          onClick={() => {
            playEffectByName("click");
            localStorage.removeItem("pedido");
            localStorage.removeItem("croquetasListas");
            localStorage.setItem("saveId"+id, JSON.stringify(saveId));
          }}
        >
          {createdAt === null ? "Empezar" : "Continuar"}
        </Button>
        <Button
        hidden={createdAt === null}
        style={{ marginLeft: "5%" }}
        onClick={() => {localStorage.removeItem(`saveId${id}`); playEffectByName("click"); refreshSaves();} }
        >
          Borrar
        </Button>
      </Card.Body>
    </Card>
  );
}

export default SaveCard;
