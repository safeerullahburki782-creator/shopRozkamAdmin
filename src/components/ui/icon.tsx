import { icons } from "lucide-react";

export const Icon = ({
  name,
  color,
  size,
  className,
  onClick,
}: {
  name: keyof typeof icons;
  color?: string;
  size?: number;
  className?: string;
  onClick?: () => void;
}) => {
  const LucideIcon = icons[name as keyof typeof icons];

  return (
    <LucideIcon
      color={color}
      size={size}
      className={className}
      onClick={onClick}
    />
  );
};
