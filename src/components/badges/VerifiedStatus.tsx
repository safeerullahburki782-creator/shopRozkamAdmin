import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  verified?: boolean;
};

export const StatusBadge = ({ verified }: StatusBadgeProps) => {
  return (
    <div
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
        verified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      )}
    >
      {verified ? (
        <>
          <CheckCircle2 className="w-4 h-4 mr-1" />
          Verified
        </>
      ) : (
        <>
          <XCircle className="w-4 h-4 mr-1" />
          Not Verified
        </>
      )}
    </div>
  );
};
