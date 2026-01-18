import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import InstructionItem from "./InstructionItem";

const ItemType = { INSTRUCTION: "instruction" };

const DraggableInstructionItem = ({
  id,
  index,
  moveInstruction,
  onDrop,
  ...props
}: any) => {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: ItemType.INSTRUCTION,
    hover(item: any) {
      if (!ref.current) return;
      if (item.index === index) return;
      moveInstruction(item.index, index);
      item.index = index;
    },
    drop: onDrop,
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType.INSTRUCTION,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.6 : 1 }}>
      <InstructionItem {...props} />
    </div>
  );
};

export default DraggableInstructionItem;
