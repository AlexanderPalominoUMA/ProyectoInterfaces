import { useState, useEffect } from 'react';

export function useDraggable(items, onDrop) {
  const [draggedId, setDraggedId] = useState(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [positions, setPositions] = useState(() => (
    items.reduce((acc, item) => {
      acc[item.id] = { x: item.x, y: item.y };
      return acc;
    }, {})
  ));

  // Sync positions if items change
  useEffect(() => {
    const pos = {};
    items.forEach(i => pos[i.id] = { x: i.x, y: i.y });
    setPositions(pos);
  }, [items]);

  // mouse / touch move & end handlers
  useEffect(() => {
    function handleMove(e) {
      if (draggedId == null) return;
      const clientX = e.touches?.[0]?.clientX ?? e.clientX;
      const clientY = e.touches?.[0]?.clientY ?? e.clientY;
      const { x: offX, y: offY } = mouseOffset;
      setPositions(prev => ({
        ...prev,
        [draggedId]: {
          x: clientX - offX,
          y: clientY - offY
        }
      }));
    }

    function handleEnd(e) {
      if (draggedId != null) {
        // detectar drop target
        onDrop(draggedId, positions[draggedId]);
        setDraggedId(null);
      }
    }

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [draggedId, mouseOffset, positions, onDrop]);

  // arrancar drag
  function startDrag(id, clientX, clientY) {
    setDraggedId(id);
    const { x, y } = positions[id];
    setMouseOffset({ x: clientX - x, y: clientY - y });
  }

  // exposicion
  const itemsWithPos = items.map(i => ({ ...i, x: positions[i.id]?.x, y: positions[i.id]?.y }));
  return {
    items: itemsWithPos,
    startDrag
  };
}
