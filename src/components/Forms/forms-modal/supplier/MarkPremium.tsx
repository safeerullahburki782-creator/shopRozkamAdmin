"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import LabelInputContainer from "../../LabelInputContainer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { markSupplierPremiumSchema } from "@/schemas/FormsValidation";

type MarkSupplierPremiumModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitHandler: (customText: string) => void;
  mode?: "direct" | "warn";
};

const MarkSupplierPremiumModal: React.FC<MarkSupplierPremiumModalProps> = ({
  open,
  onOpenChange,
  onSubmitHandler,
  mode = "direct",
}) => {
  const form = useForm<z.infer<typeof markSupplierPremiumSchema>>({
    resolver: zodResolver(markSupplierPremiumSchema),
    defaultValues: {
      customText: "",
    },
  });

  const onSubmit = (data: z.infer<typeof markSupplierPremiumSchema>) => {
    onSubmitHandler(data.customText);
    form.reset();
  };

  const title = mode === "warn" ? "Warn Supplier" : "Mark Premium";
  const submitText = mode === "warn" ? "Warn" : "Submit";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-[80vw] md:max-w-md h-fit overflow-y-auto scrollbar-custom"
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-primary text-xl font-bold pt-4">
            {title}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <LabelInputContainer>
              <Label htmlFor="customText">Custom Text</Label>
              <FormField
                control={form.control}
                name="customText"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Enter custom text"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </LabelInputContainer>

            <Button
              type="submit"
              className="w-full text-white font-medium mt-4"
            >
              {submitText}
            </Button>

            <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent mt-6 h-[1px] w-full" />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MarkSupplierPremiumModal;
