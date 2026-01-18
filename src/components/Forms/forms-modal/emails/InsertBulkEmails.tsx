import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import LabelInputContainer from "../../LabelInputContainer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { filterStatus } from "@/constant/data";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useDeleteBulkEmails,
  useGetSupplierList,
  useInsertEmails,
  useSearchBulkEmails,
} from "@/hooks/apis/useEmails";
import { useContextConsumer } from "@/context/Context";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteOnlySchema,
  insertEmailsSchema,
} from "@/schemas/FormsValidation";
import { cn } from "@/lib/utils";

type FullInsertForm = z.infer<typeof insertEmailsSchema>;
type DeleteOnlyForm = z.infer<typeof deleteOnlySchema>;
type FormDataType = FullInsertForm | DeleteOnlyForm;

const InsertEmailsModals: React.FC<any> = ({
  open,
  onOpenChange,
  deleteBulk,
  searchBulk,
  onSearchSuccess,
}) => {
  const { token } = useContextConsumer();

  const schema =
    deleteBulk || searchBulk ? deleteOnlySchema : insertEmailsSchema;

  const form = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues: deleteBulk
      ? {
          emails: "",
        }
      : {
          userUuid: "",
          emails: "",
          status: "",
          remarks: "",
        },
  });

  const { data: list } = useGetSupplierList(token);
  const { mutate: insert, isPending: inserting } = useInsertEmails();
  const { mutate: searchBulkMails, isPending: searching } =
    useSearchBulkEmails();
  const { mutate: deleteBulkMails, isPending: deleting } =
    useDeleteBulkEmails();

  const onSubmit = (formData: z.infer<typeof schema>) => {
    if (searchBulk) {
      searchBulkMails(
        {
          data: formData,
          token: token,
        },
        {
          onSuccess: (res) => {
            if (res?.success) {
              onSearchSuccess?.(res.data);
              form.reset();
              onOpenChange();
            }
          },
        }
      );
    } else if (deleteBulk) {
      deleteBulkMails(
        {
          data: formData,
          token: token,
        },
        {
          onSuccess: (res) => {
            if (res?.success) {
              onOpenChange();
            }
          },
        }
      );
    } else {
      insert(
        {
          data: formData,
          token: token,
        },
        {
          onSuccess: (res) => {
            if (res?.success) {
              onOpenChange();
            }
          },
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-[80vw] md:max-w-md h-[70vh] overflow-y-auto scrollbar-custom",
          deleteBulk || (searchBulk && "h-[45vh]")
        )}
      >
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-primary text-xl font-bold">
            {searchBulk
              ? "Search Bulk Emails"
              : deleteBulk
              ? "Delete Bulk Emails"
              : "Insert Emails"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="2" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-3 mb-4">
              <LabelInputContainer className="mb-1">
                <Label htmlFor="emails" className="dark:text-farmacieGrey">
                  Enter Emails
                </Label>
                <FormField
                  control={form.control}
                  name="emails"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={5}
                          placeholder="Paste multiple emails here (comma or newline separated)"
                          className="w-full p-3 rounded-md border border-estateLightGray dark:bg-background dark:text-white outline-none focus:border-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </LabelInputContainer>

              {!deleteBulk && !searchBulk && (
                <>
                  <LabelInputContainer className="mb-1">
                    <Label
                      htmlFor="userUuid"
                      className="dark:text-farmacieGrey"
                    >
                      Select Supplier
                    </Label>
                    <FormField
                      control={form.control}
                      name="userUuid"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select onValueChange={field.onChange}>
                              <SelectTrigger className="p-3 py-5 rounded-md border border-estateLightGray">
                                <SelectValue placeholder="Select Supplier" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl">
                                <SelectGroup>
                                  <SelectLabel>Supplier List</SelectLabel>
                                  {list?.data?.map((supplier: any) => (
                                    <SelectItem
                                      key={supplier.uuid}
                                      value={supplier.uuid}
                                    >
                                      {supplier.username}
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

                  {/* Status Dropdown */}
                  <LabelInputContainer className="mb-1">
                    <Label htmlFor="status" className="dark:text-farmacieGrey">
                      Status
                    </Label>
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select onValueChange={field.onChange}>
                              <SelectTrigger className="p-3 py-5 rounded-md border border-estateLightGray">
                                <SelectValue placeholder="Select Status" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl">
                                <SelectGroup>
                                  <SelectLabel>Status</SelectLabel>
                                  {filterStatus.map((s) => (
                                    <SelectItem key={s.value} value={s.value}>
                                      {s.label}
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

                  {/* Remarks Input */}
                  <LabelInputContainer>
                    <Label htmlFor="remarks">Remarks</Label>
                    <FormField
                      control={form.control}
                      name="remarks"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Enter remarks (optional)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </LabelInputContainer>
                </>
              )}
            </div>

            <Button
              className="w-full text-white font-medium mt-4"
              type="submit"
              disabled={inserting || deleting || searching}
            >
              Submit
            </Button>
            <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent mt-6 h-[1px] w-full" />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InsertEmailsModals;
