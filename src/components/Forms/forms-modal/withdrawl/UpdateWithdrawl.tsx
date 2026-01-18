import React from "react";
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
import { withdrawlUpdate } from "@/schemas/FormsValidation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { withdrawlOption } from "@/constant/data";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContextConsumer } from "@/context/Context";
import {
  useWithdrawlBonusUpdate,
  useWithdrawlReferralBonusUpdate,
  useWithdrawlUpdate,
} from "@/hooks/apis/useWithdrawl";
import { Input } from "@/components/ui/input";

const WithdrawlUpdateModal: React.FC<any> = ({
  open,
  onClose,
  withdrawl,
  bonus,
}) => {
  const { token } = useContextConsumer();

  const form = useForm<z.infer<typeof withdrawlUpdate>>({
    resolver: zodResolver(withdrawlUpdate),
    defaultValues: {
      action: "",
      remarks: "",
    },
  });
  const selectedAction = form.watch("action");

  const { mutate: updateWithdrawl, isPending: updating } = useWithdrawlUpdate();
  const { mutate: updateReferralBonusWithdrawl, isPending: bonusUpdating } =
    useWithdrawlReferralBonusUpdate();

  const onSubmit = (data: z.infer<typeof withdrawlUpdate>) => {
    const formData = new FormData();
    formData.append("withdrawalUuid", withdrawl.uuid);
    formData.append("action", data.action);
    if (data.remarks) {
      formData.append("remarks", data.remarks);
    }
    if (data.action === "approve" && data.paymentScreenshot) {
      formData.append("paymentScreenshot", data.paymentScreenshot);
    }

    const payload = {
      data: formData,
      token,
    };

    console.log(payload, "payloadpayload");

    const handler =
      withdrawl?.withdrawalType === "referral-bonus"
        ? updateReferralBonusWithdrawl
        : updateWithdrawl;

    handler(payload, {
      onSuccess: (res) => {
        if (res?.success) {
          form.reset();
          onClose();
        }
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[80vw] md:max-w-md h-[50vh] overflow-y-auto scrollbar-custom">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-primary text-xl font-bold">
            Handle Withdrawl
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="2" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-3 mb-4">
              <LabelInputContainer className="mb-1">
                <Label htmlFor="action" className="dark:text-farmacieGrey">
                  Action
                </Label>
                <FormField
                  control={form.control}
                  name="action"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={(value: string) => {
                            field.onChange(value);
                          }}
                        >
                          <SelectTrigger
                            className={cn(
                              "p-3 py-5 rounded-md border border-estateLightGray focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-primary/20"
                            )}
                          >
                            <SelectValue placeholder="Select Action" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectGroup>
                              <SelectLabel>Select Action</SelectLabel>
                              {withdrawlOption.map((status) => (
                                <SelectItem
                                  key={status.value}
                                  value={status.value}
                                  disabled={status.value === "bad"}
                                >
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
                <Label htmlFor="remarks">Remarks</Label>
                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter remarks (optional)"
                          type="text"
                          id="remarks"
                          className="outline-none focus:border-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </LabelInputContainer>

              {selectedAction === "approve" && (
                <LabelInputContainer className="my-1.5">
                  <Label
                    htmlFor="paymentScreenshot"
                    className="dark:text-farmacieGrey"
                  >
                    Upload Proof Image
                  </Label>
                  <FormField
                    control={form.control}
                    name="paymentScreenshot"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              field.onChange(e.target.files?.[0])
                            }
                            className="w-full rounded-md border border-estateLightGray dark:bg-background dark:text-white outline-none focus:border-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </LabelInputContainer>
              )}
            </div>
            <Button
              className="w-full text-white font-medium mt-4"
              type="submit"
              disabled={updating || bonusUpdating}
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

export default WithdrawlUpdateModal;
