import { FC } from "react";
import { Pencil, Trash2, BadgeCheck, BadgeX, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";

interface FaqProps {
  question: string;
  answer: string;
  isEnabled: boolean;
  uuid: string;
  order: number;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}

const FaqItem: FC<FaqProps> = ({
  question,
  answer,
  isEnabled,
  order,
  onEdit,
  onDelete,
  onToggle,
}) => {
  return (
    <div
      className={clsx(
        "relative bg-white border p-4 pt-8 rounded-xl shadow-sm transition-all hover:bg-gray-50",
        "cursor-grab active:cursor-grabbing group"
      )}
    >
      <div className="absolute top-2 left-2 z-10">
        {isEnabled ? (
          <Badge
            className="bg-green-200 text-green-800 border border-green-300 text-xs px-2 py-0.5 rounded-full cursor-pointer shadow-sm hover:bg-green-300 transition-colors flex items-center gap-1"
            onClick={onToggle}
          >
            <BadgeCheck className="w-3.5 h-3.5" />
            Active
          </Badge>
        ) : (
          <Badge
            className="bg-red-100 text-red-800 border border-red-300 text-xs px-2 py-0.5 rounded-full cursor-pointer shadow-sm hover:bg-red-300 transition-colors flex items-center gap-1"
            onClick={onToggle}
          >
            <BadgeX className="w-3.5 h-3.5" />
            Inactive
          </Badge>
        )}
      </div>
      <div className="absolute top-1 right-2 z-10 flex">
        <Button size="icon" variant="ghost" onClick={onEdit}>
          <Pencil className="w-4 h-4 text-blue-600" />
        </Button>
        <Button size="icon" variant="ghost" onClick={onDelete}>
          <Trash2 className="w-4 h-4 text-red-600" />
        </Button>
      </div>
      <div className="pt-6 flex items-start gap-3">
        <GripVertical className="w-5 h-5 text-gray-400 mt-0.5 group-hover:text-gray-600" />
        <div>
          <p className="font-medium text-gray-800">{question}</p>
          <p className="text-sm text-gray-500 mt-1 whitespace-pre-line">
            {answer}
          </p>
          <p className="text-xs text-gray-400 mt-1">Order: {order}</p>
        </div>
      </div>
    </div>
  );
};

export default FaqItem;
