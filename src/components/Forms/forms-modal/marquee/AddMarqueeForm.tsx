import React, { useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useContextConsumer } from "@/context/Context";
import { addMarquee } from "@/schemas/FormsValidation";
import { Textarea } from "@/components/ui/textarea";
import LabelInputContainer from "../../LabelInputContainer";
import { useAddMarquee, useUpdateMarquee } from "@/hooks/apis/useMarquee";

const AddMarqueeForm = ({
  marquee,
  mode,
  onClose,
}: {
  marquee: any;
  mode: "add" | "view" | "edit";
  onClose: () => void;
}) => {
  const isViewMode = mode === "view";
  const { token } = useContextConsumer();
  const { mutate: addNewMarquee, isPending: adding } = useAddMarquee();
  const { mutate: updateMarquee, isPending: updating } = useUpdateMarquee();

  console.log(marquee, "marqueemarquee");

  const form = useForm<z.infer<typeof addMarquee>>({
    resolver: zodResolver(addMarquee),
    defaultValues: {
      message: "",
    },
  });

  const { reset } = form;
  useEffect(() => {
    if (marquee) {
      reset({
        message: marquee.message || "",
      });
    }
  }, [marquee, reset]);

  const onSubmit = (data: z.infer<typeof addMarquee>) => {
    if (mode === "add") {
      addNewMarquee(
        { data, token },
        {
          onSuccess: (log) => {
            if (log?.success) {
              onClose();
            }
          },
        }
      );
    } else if (mode === "edit") {
      const updatedData = {
        data: {
          uuid: marquee?.uuid,
          message: data.message,
        },
        token,
      };

      updateMarquee(updatedData, {
        onSuccess: (log) => {
          if (log?.success) {
            onClose();
          }
        },
      });
    }
  };

  return (
    <>
      <Form {...form}>
        <form className="2" onSubmit={form.handleSubmit(onSubmit)}>
          <LabelInputContainer className="mb-1">
            <Label htmlFor="message" className="dark:text-farmacieGrey">
              Enter Marquee Message
            </Label>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={5}
                      placeholder="Paste enter marquee"
                      className="w-full p-3 rounded-md border border-estateLightGray dark:bg-background dark:text-white outline-none focus:border-primary"
                      disabled={isViewMode}
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
            disabled={isViewMode || adding || updating}
          >
            {mode === "add" ? "Submit" : "Update"}
          </Button>
          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent mt-6 h-[1px] w-full" />
        </form>
      </Form>
    </>
  );
};

export default AddMarqueeForm;
