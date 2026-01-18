import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useContextConsumer } from "@/context/Context";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useUpdateWithdrawlMethod } from "@/hooks/apis/useSupplier";

const UpdateWithdrawlMethodModal: React.FC<any> = ({
  open,
  onOpenChange,
  method,
}) => {
  const { token } = useContextConsumer();
  const { mutate: updateWithdrawlMethod, isPending: updating } =
    useUpdateWithdrawlMethod();

  const form = useForm({
    defaultValues: {
      accountNumber: "",
      accountTitle: "",
    },
    mode: "onSubmit",
    criteriaMode: "firstError",
  });

  useEffect(() => {
    if (method) {
      form.reset({
        accountNumber: method.accountNumber || "",
        accountTitle: method.accountTitle || "",
      });
    }
  }, [method, form]);

  const onSubmit = (values: any) => {
    const payload = {
      data: {
        uuid: method.uuid,
        accountNumber: values.accountNumber,
        accountTitle: values.accountTitle,
      },
      token,
    };

    updateWithdrawlMethod(payload, {
      onSuccess: (res) => {
        if (res?.success) {
          onOpenChange(false);
        }
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[80vw] md:max-w-md h-auto overflow-y-auto scrollbar-custom space-y-4">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-primary text-xl font-bold pt-4">
            Add Withdrawal Method
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="accountNumber"
              rules={{ required: "Account number is required" }}
              render={({ field }) => (
                <FormItem>
                  <Label>Account Number</Label>
                  <FormControl>
                    <Input placeholder="Account no here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountTitle"
              rules={{ required: "Account title is required" }}
              render={({ field }) => (
                <FormItem>
                  <Label>Account Title</Label>
                  <FormControl>
                    <Input placeholder="e.g. John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={updating}>
              {updating ? "Updating..." : "Update Method"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateWithdrawlMethodModal;
