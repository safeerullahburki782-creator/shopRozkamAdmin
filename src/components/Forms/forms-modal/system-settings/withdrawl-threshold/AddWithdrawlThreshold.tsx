import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import EmailRewardForm from "./AddWithdrawlThresholdForm";
import WithdrawlThresholdForm from "./AddWithdrawlThresholdForm";

const WithdrawlThresholdModal: React.FC<any> = ({
  open,
  onOpenChange,
  mode,
  threshold,
}) => {
  const [currentMode, setCurrentMode] = useState(mode);

  useEffect(() => {
    if (open && mode !== "add") {
      setCurrentMode("view");
    }
  }, [open, mode]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[80vw] md:max-w-md h-[35vh] overflow-y-auto scrollbar-custom">
        <DialogHeader
          className={cn(
            currentMode === "view"
              ? "flex flex-row items-center justify-between"
              : ""
          )}
        >
          <DialogTitle className="text-primary text-xl font-bold pt-4">
            {currentMode === "add"
              ? "Add Withdrawl Threshold"
              : "Update Withdrawl Threshold"}
          </DialogTitle>
        </DialogHeader>
        <WithdrawlThresholdForm
          mode={mode}
          onClose={onOpenChange}
          threshold={threshold}
        />
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawlThresholdModal;
