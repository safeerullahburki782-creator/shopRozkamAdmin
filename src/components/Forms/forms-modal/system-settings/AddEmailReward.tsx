import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import EmailRewardForm from "./AddEmailRewardForm";

const EmailRewardModal: React.FC<any> = ({
  open,
  onOpenChange,
  mode,
  emailReward,
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
              ? "Add Email Reward"
              : "Update Email Rewards"}
          </DialogTitle>
          {/* {currentMode === "view" && (
            <Button size="sm" onClick={() => setCurrentMode("edit")}>
              Edit <Pencil className="w-3.5 h-3.5 ml-2" />
            </Button>
          )} */}
        </DialogHeader>
        <EmailRewardForm
          mode={mode}
          onClose={onOpenChange}
          emailReward={emailReward}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EmailRewardModal;
