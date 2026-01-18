"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import LabelInputContainer from "../LabelInputContainer";
import { useContextConsumer } from "@/context/Context";
import {
  useCreateNewPassword,
  useUpdatePassword,
} from "@/hooks/apis/usePasswords";
import { addPasswordSchema } from "@/schemas/FormsValidation";
import { Textarea } from "@/components/ui/textarea";

const AddPasswordForm = ({
  mode,
  onClose,
  password,
  bulkUpdate,
}: {
  mode: "add" | "view" | "edit";
  onClose: () => void;
  password: any;
  bulkUpdate?: boolean;
}) => {
  const isViewMode = mode === "view";
  const { token } = useContextConsumer();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { mutate: createPassword, isPending: loading } = useCreateNewPassword();
  const { mutate: updatePassword, isPending: updating } =
    useUpdatePassword(token);

  const form = useForm({
    resolver: zodResolver(addPasswordSchema),
    defaultValues: {
      passwords: "",
    },
  });

  const onSubmit = (data: any) => {
    if (mode === "add" && !bulkUpdate) {
      createPassword(
        { data, token },
        {
          onSuccess: (log) => {
            if (log?.success) onClose();
          },
        }
      );
    } else if (bulkUpdate) {
      updatePassword(
        { data },
        {
          onSuccess: (log) => {
            if (log?.success) {
              onClose();
            }
          },
        }
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <LabelInputContainer className="mb-1">
          <Label htmlFor="passwords" className="dark:text-farmacieGrey">
            Password
          </Label>
          <FormField
            control={form.control}
            name="passwords"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={5}
                    placeholder="Paste multiple passwords here (comma or newline separated)"
                    className="w-full p-3 rounded-md border border-estateLightGray dark:bg-background dark:text-white outline-none focus:border-primary"
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
          disabled={isViewMode || loading || updating}
        >
          {mode === "add" && bulkUpdate
            ? "Bulk Update Passwords"
            : mode === "add"
            ? "Create Password(s)"
            : "Update Password"}
        </Button>
      </form>
    </Form>
  );
};

export default AddPasswordForm;
