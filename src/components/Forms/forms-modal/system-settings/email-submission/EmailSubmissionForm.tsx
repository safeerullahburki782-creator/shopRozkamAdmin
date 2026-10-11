"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import LabelInputContainer from "../../../LabelInputContainer";
import { useContextConsumer } from "@/context/Context";
import { emailSubmissionFormSchema } from "@/schemas/FormsValidation";
import { useUpdateEmailSubmissionSetting } from "@/hooks/apis/useSystemSettings";

// datetime-local inputs work with "yyyy-MM-ddTHH:mm" in the admin's local time
const DATETIME_LOCAL_FORMAT = "yyyy-MM-dd'T'HH:mm";

// A saved resume time that has already passed is left over from an earlier
// pause, so the form starts empty instead
const toDateTimeLocal = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime()) || date.getTime() <= Date.now()) return "";
  return format(date, DATETIME_LOCAL_FORMAT);
};

const EmailSubmissionForm = ({
  setting,
  onClose,
}: {
  setting: EmailSubmissionSetting | null;
  onClose: () => void;
}) => {
  const { token } = useContextConsumer();
  const { mutate: updateSetting, isPending } =
    useUpdateEmailSubmissionSetting();

  // The modal unmounts this form when closed, so the saved notice is loaded on
  // every open; background refetches never overwrite what the admin is typing
  const form = useForm<z.infer<typeof emailSubmissionFormSchema>>({
    resolver: zodResolver(emailSubmissionFormSchema),
    defaultValues: {
      title: setting?.title || "",
      message: setting?.message || "",
      resumeAt: toDateTimeLocal(setting?.resumeAt),
    },
  });

  const onSubmit = (data: z.infer<typeof emailSubmissionFormSchema>) => {
    updateSetting(
      {
        data: {
          isDisabled: true,
          title: data.title,
          message: data.message,
          resumeAt: data.resumeAt
            ? new Date(data.resumeAt).toISOString()
            : null,
        },
        token,
      },
      {
        onSuccess: (res: any) => {
          if (res?.success) {
            onClose();
          }
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          While disabled, users cannot submit emails and will see this notice
          as a popup.
        </p>

        <LabelInputContainer>
          <Label htmlFor="title">Title (optional)</Label>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    id="title"
                    placeholder="e.g. System update in progress"
                    type="text"
                    className="outline-none focus:border-primary"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="message">Message for users</Label>
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    id="message"
                    rows={5}
                    placeholder="e.g. We are updating the system. Email submission will open again today at 6:00 PM."
                    className="outline-none focus:border-primary"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="resumeAt">Expected resume time (optional)</Label>
          <FormField
            control={form.control}
            name="resumeAt"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    id="resumeAt"
                    type="datetime-local"
                    min={format(new Date(), DATETIME_LOCAL_FORMAT)}
                    className="outline-none focus:border-primary"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Only shown to users. Email submission stays disabled until you
            enable it again.
          </p>
        </LabelInputContainer>

        <Button
          className="w-full text-white font-medium"
          type="submit"
          disabled={isPending}
        >
          {setting?.isDisabled ? "Update Notice" : "Disable Email Submission"}
        </Button>
      </form>
    </Form>
  );
};

export default EmailSubmissionForm;
