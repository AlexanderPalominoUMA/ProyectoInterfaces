import { Button, Card } from "react-bootstrap";
import { Link } from "react-router";

function SaveCard({ id, title, createdAt }) {
  return (
    <Card>
      <Card.Header>{title}</Card.Header>
      <Card.Body>
        <Card.Text>
          Fecha de creaccion: {createdAt === null ? "-" : createdAt}
        </Card.Text>
        <Button as={Link} to={`/game/${id}`} variant="primary">
          {createdAt === null ? "Empezar" : "Continuar"}
        </Button>
      </Card.Body>
    </Card>
  );
}

export default SaveCard;
