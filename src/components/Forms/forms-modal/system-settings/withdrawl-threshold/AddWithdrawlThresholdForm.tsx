"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useContextConsumer } from "@/context/Context";
import { addWithdrawThresholdFormSchema } from "@/schemas/FormsValidation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  useAddWithdrawThreshold,
  useUpdateWithdrawthreshold,
} from "@/hooks/apis/useSystemSettings";
import LabelInputContainer from "@/components/Forms/LabelInputContainer";

const WithdrawlThresholdForm = ({
  mode,
  onClose,
  threshold,
}: {
  mode: "add" | "view" | "edit";
  onClose: () => void;
  threshold: any;
}) => {
  const { token } = useContextConsumer();

  const { mutate: addWithdrawThreshold, isPending: adding } =
    useAddWithdrawThreshold();
  const { mutate: updateWithdrawThreshold, isPending: updating } =
    useUpdateWithdrawthreshold();

  const form = useForm({
    resolver: zodResolver(addWithdrawThresholdFormSchema),
    defaultValues: {
      threshold: "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (threshold) {
      reset({
        threshold: threshold || "",
      });
    }
  }, [threshold, reset]);

  const onSubmit = (data: any) => {
    if (mode === "add") {
      addWithdrawThreshold(
        { data, token },
        {
          onSuccess: (log) => {
            if (log?.success) {
              onClose();
            }
          },
        }
      );
    } else if (mode === "edit" || mode === "view") {
      const updatedData = {
        data: { threshold: data.threshold },
        token,
      };
      updateWithdrawThreshold(updatedData, {
        onSuccess: (log) => {
          if (log?.success) {
            onClose();
          }
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <LabelInputContainer>
          <Label htmlFor="threshold">Withdrawl Threshold</Label>
          <FormField
            control={form.control}
            name="threshold"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    disabled={mode !== "add" && mode !== "view"}
                    placeholder="Withdrawl Threshold"
                    type="number"
                    className="outline-none focus:border-primary"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </LabelInputContainer>
        <Button
          className="w-full text-white font-medium mt-4"
          type="submit"
          disabled={(mode !== "add" && mode !== "view") || adding || updating}
        >
          {mode === "add"
            ? "Add Withdrawl Threshold"
            : "Update Withdrawl Threshold"}
        </Button>
      </form>
    </Form>
  );
};

export default WithdrawlThresholdForm;
