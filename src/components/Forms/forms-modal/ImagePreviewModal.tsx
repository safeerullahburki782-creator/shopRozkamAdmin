import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import Image from "next/image";

interface ImagePreviewModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string | null;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  open,
  onClose,
  imageUrl,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] md:max-w-xl p-4 space-y-4">
        <DialogHeader>
          <DialogTitle className="text-lg">Screenshot Preview</DialogTitle>
        </DialogHeader>
        {imageUrl && (
          <Image
            width={600}
            height={600}
            src={imageUrl}
            alt="Screenshot Preview"
            className="w-full max-h-[60vh] object-contain rounded border"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewModal;
