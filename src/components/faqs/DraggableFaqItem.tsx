import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import FaqItem from "./FaqItem";

const ItemType = { FAQ: "faq" };

const DraggableFaqItem = ({ id, index, moveFaq, onDrop, ...props }: any) => {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: ItemType.FAQ,
    hover(item: any, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveFaq(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    drop: onDrop,
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType.FAQ,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.6 : 1 }}>
      <FaqItem {...props} />
    </div>
  );
};

export default DraggableFaqItem;
