import { useDrag, useDrop } from "react-dnd";

function DraggableItem({ id, src, onDrop }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "IMAGE",
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "IMAGE",
    drop: (item) => {
      onDrop(item.id, id); // Pass the ID of the dropped item and the target item
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        position: "relative",
      }}
    >
      <img
        src={src}
        alt={id}
        style={{
          width: "200px",
          height: "auto",
          backgroundColor: isOver && canDrop ? "lightgreen" : "transparent",
        }}
      />
    </div>
  );
}

export default DraggableItem;
