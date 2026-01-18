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
import { addEmailRewardFormSchema } from "@/schemas/FormsValidation";
import LabelInputContainer from "../../LabelInputContainer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  useAddEmailReward,
  useUpdateEmailReward,
} from "@/hooks/apis/useSystemSettings";

const EmailRewardForm = ({
  mode,
  onClose,
  emailReward,
}: {
  mode: "add" | "view" | "edit";
  onClose: () => void;
  emailReward: any;
}) => {
  const isViewMode = mode === "view";
  const { token } = useContextConsumer();

  const { mutate: addEmailReward, isPending: adding } = useAddEmailReward();
  const { mutate: updateEmailReward, isPending: updating } =
    useUpdateEmailReward();

  const form = useForm({
    resolver: zodResolver(addEmailRewardFormSchema),
    defaultValues: {
      reward: "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (emailReward) {
      reset({
        reward: emailReward || "",
      });
    }
  }, [emailReward, reset]);

  const onSubmit = (data: any) => {
    if (mode === "add") {
      addEmailReward(
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
        data: { reward: data.reward },
        token,
      };
      updateEmailReward(updatedData, {
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
          <Label htmlFor="reward">Email Reward</Label>
          <FormField
            control={form.control}
            name="reward"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    disabled={mode !== "add" && mode !== "view"}
                    placeholder="Email Reward"
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
          disabled={(mode !== "add" && mode !== "view") || adding}
        >
          {mode === "add" ? "Add Email Reward" : "Update Email Reward"}
        </Button>
      </form>
    </Form>
  );
};

export default EmailRewardForm;
