import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import MarqueeItem from "./MarqueeItem";

const ItemType = { MARQUEE: "marquee" };

const DraggableMarqueeItem = ({
  id,
  index,
  moveMarquee,
  onDrop,
  ...props
}: any) => {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: ItemType.MARQUEE,
    hover(item: any, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveMarquee(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    drop: onDrop,
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType.MARQUEE,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.6 : 1 }}>
      <MarqueeItem {...props} />
    </div>
  );
};

export default DraggableMarqueeItem;
