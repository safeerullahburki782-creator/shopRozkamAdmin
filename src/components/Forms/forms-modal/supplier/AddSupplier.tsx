import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import AddSupplierForm from "../../suppliers/AddSupplier";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

const SupplierModal: React.FC<any> = ({
  open,
  onOpenChange,
  mode,
  supplier,
}) => {
  const [currentMode, setCurrentMode] = useState(mode);

  useEffect(() => {
    if (open && mode !== "add") {
      setCurrentMode("view");
    }
  }, [open, mode]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-[80vw] md:max-w-md h-[70vh] lg:h-[92vh] overflow-y-auto scrollbar-custom",
          currentMode === "add" && "lg:h-[65vh]"
        )}
      >
        <DialogHeader
          className={cn(
            currentMode === "view"
              ? "flex flex-row items-center justify-between"
              : ""
          )}
        >
          <DialogTitle className="text-primary text-xl font-bold pt-4">
            {currentMode === "add" ? "Add Supplier" : "Update Supplier"}
          </DialogTitle>
          {currentMode === "view" && (
            <Button size="sm" onClick={() => setCurrentMode("edit")}>
              Edit <Pencil className="w-3.5 h-3.5 ml-2" />
            </Button>
          )}
        </DialogHeader>
        <AddSupplierForm
          mode={currentMode}
          onClose={onOpenChange}
          supplier={supplier}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SupplierModal;
