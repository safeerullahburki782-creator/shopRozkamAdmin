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
import { addBonusFormSchema } from "@/schemas/FormsValidation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  useAddSignupBonus,
  useUpdateSignupBonus,
} from "@/hooks/apis/useSystemSettings";
import LabelInputContainer from "@/components/Forms/LabelInputContainer";

const AddSignupBonusForm = ({
  mode,
  onClose,
  signupBonus,
}: {
  mode: "add" | "view" | "edit";
  onClose: () => void;
  signupBonus: any;
}) => {
  const { token } = useContextConsumer();

  const { mutate: addSignupBonus, isPending: adding } = useAddSignupBonus();
  const { mutate: updateSignupBonus, isPending: updating } =
    useUpdateSignupBonus();

  const form = useForm({
    resolver: zodResolver(addBonusFormSchema),
    defaultValues: {
      bonus: "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (signupBonus) {
      reset({
        bonus: signupBonus || "",
      });
    }
  }, [signupBonus, reset]);

  const onSubmit = (data: any) => {
    if (mode === "add") {
      addSignupBonus(
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
        data: { bonus: data.bonus },
        token,
      };
      updateSignupBonus(updatedData, {
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
          <Label htmlFor="bonus">Bonus</Label>
          <FormField
            control={form.control}
            name="bonus"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    disabled={mode !== "add" && mode !== "view"}
                    placeholder="Enter Bonus"
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
          {mode === "add" ? "Add Bonus" : "Update Bonus"}
        </Button>
      </form>
    </Form>
  );
};

export default AddSignupBonusForm;
