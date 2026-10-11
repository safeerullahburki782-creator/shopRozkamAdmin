import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EmailSubmissionForm from "./EmailSubmissionForm";

const EmailSubmissionModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setting: EmailSubmissionSetting | null;
}> = ({ open, onOpenChange, setting }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[80vw] md:max-w-lg max-h-[90vh] overflow-y-auto scrollbar-custom">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl font-bold pt-4">
            {setting?.isDisabled
              ? "Update Email Submission Notice"
              : "Disable Email Submission"}
          </DialogTitle>
        </DialogHeader>
        <EmailSubmissionForm
          setting={setting}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EmailSubmissionModal;
