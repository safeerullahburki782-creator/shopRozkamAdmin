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
import { addFaq } from "@/schemas/FormsValidation";
import { Textarea } from "@/components/ui/textarea";
import LabelInputContainer from "../../LabelInputContainer";
import { useAddFaqs, useUpdateFaq } from "@/hooks/apis/useFaqs";

const AddFaqForm = ({
  faq,
  mode,
  onClose,
}: {
  faq: any;
  mode: "add" | "view" | "edit";
  onClose: () => void;
}) => {
  const isViewMode = mode === "view";
  const { token } = useContextConsumer();
  const { mutate: add, isPending: adding } = useAddFaqs();
  const { mutate: updateFAq, isPending: updating } = useUpdateFaq();

  const form = useForm<z.infer<typeof addFaq>>({
    resolver: zodResolver(addFaq),
    defaultValues: {
      question: "",
      answer: "",
    },
  });

  const { reset } = form;
  useEffect(() => {
    if (faq) {
      reset({
        question: faq.question || "",
        answer: faq.answer || "",
      });
    }
  }, [faq, reset]);

  const onSubmit = (data: z.infer<typeof addFaq>) => {
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
          uuid: faq?.uuid,
          question: data.question,
          answer: data.answer,
        },
        token,
      };

      updateFAq(updatedData, {
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
              <Label htmlFor="question" className="dark:text-farmacieGrey">
                Enter question
              </Label>
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={2}
                        placeholder="Paste enter question"
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
              <Label htmlFor="answer" className="dark:text-farmacieGrey">
                Enter answer
              </Label>
              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={5}
                        placeholder="Paste enter answer"
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

export default AddFaqForm;
