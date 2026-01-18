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
import { addInsSchema } from "@/schemas/FormsValidation";
import { Textarea } from "@/components/ui/textarea";
import LabelInputContainer from "../../LabelInputContainer";
import { useAddIns, useUpdateIns } from "@/hooks/apis/useInts";

const AddInstForm = ({
  ins,
  mode,
  onClose,
}: {
  ins: any;
  mode: "add" | "view" | "edit";
  onClose: () => void;
}) => {
  const isViewMode = mode === "view";
  const { token } = useContextConsumer();
  const { mutate: add, isPending: adding } = useAddIns();
  const { mutate: updateIns, isPending: updating } = useUpdateIns();

  const form = useForm<z.infer<typeof addInsSchema>>({
    resolver: zodResolver(addInsSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const { reset } = form;
  useEffect(() => {
    if (ins) {
      reset({
        title: ins.title || "",
        description: ins.description || "",
      });
    }
  }, [ins, reset]);

  const onSubmit = (data: z.infer<typeof addInsSchema>) => {
    if (mode === "add") {
      add(
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
          uuid: ins?.uuid,
          title: data.title,
          description: data.description,
        },
        token,
      };

      updateIns(updatedData, {
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
          <div className="flex flex-col gap-3 mb-4">
            <LabelInputContainer className="mb-1">
              <Label htmlFor="title" className="dark:text-farmacieGrey">
                Enter title
              </Label>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={2}
                        placeholder="enter title"
                        className="w-full p-3 rounded-md border border-estateLightGray dark:bg-background dark:text-white outline-none focus:border-primary"
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-1">
              <Label htmlFor="description" className="dark:text-farmacieGrey">
                Enter description
              </Label>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={5}
                        placeholder="enter description"
                        className="w-full p-3 rounded-md border border-estateLightGray dark:bg-background dark:text-white outline-none focus:border-primary"
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </LabelInputContainer>
          </div>

          <Button
            className="w-full text-white font-medium mt-4"
            type="submit"
            disabled={adding || updating}
          >
            Submit
          </Button>
          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent mt-6 h-[1px] w-full" />
        </form>
      </Form>
    </>
  );
};

export default AddInstForm;
