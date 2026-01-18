import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import AddSignupBonusForm from "./AddSignupBonusForm";

const SignupBonusModal: React.FC<any> = ({
  open,
  onOpenChange,
  mode,
  signupBonus,
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
            {currentMode === "add" ? "Add Signup Bonus" : "Update Signup Bonus"}
          </DialogTitle>
        </DialogHeader>
        <AddSignupBonusForm
          mode={mode}
          onClose={onOpenChange}
          signupBonus={signupBonus}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SignupBonusModal;
