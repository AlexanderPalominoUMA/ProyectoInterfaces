import { Button, Card } from "react-bootstrap";
import { Link } from "react-router";
import { useSound } from "../providers/SoundProvider";

function SaveCard({ id, title, createdAt }) {
  const { playEffectByName } = useSound();

  return (
    <Card>
      <Card.Header>{title}</Card.Header>
      <Card.Body>
        <Card.Text>
          Fecha de creaccion: {createdAt === null ? "-" : createdAt}
        </Card.Text>
        <Button as={Link} to={`/game/${id}`} variant="primary" onClick={() => playEffectByName("click")}>
          {createdAt === null ? "Empezar" : "Continuar"}
        </Button>
      </Card.Body>
    </Card>
  );
}

export default SaveCard;
