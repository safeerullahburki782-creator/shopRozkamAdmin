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
import { addCategoryWhatsappFormSchema } from "@/schemas/FormsValidation";
import LabelInputContainer from "../../LabelInputContainer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supplierCategory } from "@/constant/data";
import { cn } from "@/lib/utils";
import {
  useAddCategoryWhatsapp,
  useUpdateCategoryWhatsapp,
} from "@/hooks/apis/useCategoryWhatsapp";

const AddCategoryWhatsappForm = ({
  categoryWhtsp,
  mode,
  onClose,
}: {
  categoryWhtsp: any;
  mode: "add" | "view" | "edit";
  onClose: () => void;
}) => {
  const isViewMode = mode === "view";
  const { token } = useContextConsumer();
  const { mutate: addNewCategoryWhatsapp, isPending: adding } =
    useAddCategoryWhatsapp();
  const { mutate: updateCategoryWhatsapp, isPending: updating } =
    useUpdateCategoryWhatsapp();

  const form = useForm<z.infer<typeof addCategoryWhatsappFormSchema>>({
    resolver: zodResolver(addCategoryWhatsappFormSchema),
    defaultValues: {
      category: "",
      whatsappNumber: "",
    },
  });

  const { reset } = form;
  useEffect(() => {
    if (categoryWhtsp) {
      reset({
        category: categoryWhtsp.category || "",
        whatsappNumber: categoryWhtsp.whatsappNumber || "",
      });
    }
  }, [categoryWhtsp, reset]);

  const onSubmit = (data: z.infer<typeof addCategoryWhatsappFormSchema>) => {
    if (mode === "add") {
      addNewCategoryWhatsapp(
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
          uuid: categoryWhtsp?.uuid,
          whatsappNumber: data.whatsappNumber,
        },
        token,
      };

      updateCategoryWhatsapp(updatedData, {
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
          <LabelInputContainer className="mb-4">
            <Label htmlFor="category" className="dark:text-farmacieGrey">
              Category
            </Label>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={(value: string) => {
                        field.onChange(value);
                      }}
                      disabled={isViewMode}
                    >
                      <SelectTrigger
                        className={cn(
                          "p-3 py-5 rounded-md border border-estateLightGray focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-primary/20"
                        )}
                      >
                        <SelectValue
                          placeholder={
                            categoryWhtsp?.category || "Select Category"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectGroup>
                          <SelectLabel>Select Category</SelectLabel>
                          {supplierCategory.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="whatsappNumber">Whatsapp Number</Label>
            <FormField
              control={form.control}
              name="whatsappNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter whatsapp number"
                      type="text"
                      id="whatsappNumber"
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

export default AddCategoryWhatsappForm;
