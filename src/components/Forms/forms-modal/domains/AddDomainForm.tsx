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
import { addDomain } from "@/schemas/FormsValidation";
import LabelInputContainer from "../../LabelInputContainer";
import { useAddDomains, useUpdateDomains } from "@/hooks/apis/useDomains";
import { Input } from "@/components/ui/input";

const AddDomainForm = ({
  domain,
  mode,
  onClose,
}: {
  domain: any;
  mode: "add" | "view" | "edit";
  onClose: () => void;
}) => {
  const isViewMode = mode === "view";
  const { token } = useContextConsumer();
  const { mutate: addNewDomain, isPending: adding } = useAddDomains();
  const { mutate: updateDomain, isPending: updating } = useUpdateDomains();

  const form = useForm<z.infer<typeof addDomain>>({
    resolver: zodResolver(addDomain),
    defaultValues: {
      domain: "",
    },
  });

  const { reset } = form;
  useEffect(() => {
    if (domain) {
      reset({
        domain: domain.domain || "",
      });
    }
  }, [domain, reset]);

  const onSubmit = (data: z.infer<typeof addDomain>) => {
    if (mode === "add") {
      addNewDomain(
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
          uuid: domain?.uuid,
          domain: data.domain,
        },
        token,
      };

      updateDomain(updatedData, {
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
          <LabelInputContainer>
            <Label htmlFor="domain">Domain</Label>
            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter domain"
                      type="text"
                      id="domain"
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

export default AddDomainForm;
