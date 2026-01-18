import React, { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LabelInputContainer from "../LabelInputContainer";
import { useContextConsumer } from "@/context/Context";
import {
  useCreateNewSupplier,
  useUpdateSupplier,
} from "@/hooks/apis/useSupplier";
import {
  addNewSupplierFormSchema,
  updateSupplierFormSchema,
} from "@/schemas/FormsValidation";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supplierActiveVal, supplierCategory } from "@/constant/data";

type AddSupplierFormType = z.infer<typeof addNewSupplierFormSchema>;
type UpdateSupplierFormType = z.infer<typeof updateSupplierFormSchema>;
type CombinedFormType = AddSupplierFormType & Partial<UpdateSupplierFormType>;

const AddSupplierForm = ({
  supplier,
  mode,
  onClose,
}: {
  showInsList?: boolean;
  supplier: any;
  mode: "add" | "view" | "edit";
  onClose: () => void;
}) => {
  const isViewMode = mode === "view";
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [confirmShowPassword, setConfirmShowPassword] =
    useState<boolean>(false);
  const { token } = useContextConsumer();
  const { mutate: addNewSupplier, isPending: loading } = useCreateNewSupplier();
  const { mutate: updateSupplier, isPending: updating } = useUpdateSupplier();

  const formSchema =
    mode === "add" ? addNewSupplierFormSchema : updateSupplierFormSchema;

  const form = useForm<CombinedFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      countryCode: "+92",
      phone: "",
      password: "",
      confirmPassword: "",
      bonus: "",
      category: "",
      active: "",
      isPremium: "",
      customText: "",
    },
  });

  const { reset } = form;
  useEffect(() => {
    if (supplier) {
      reset({
        username: supplier.username || "",
        countryCode: supplier.countryCode || "",
        phone: supplier.phone || "",
        password: supplier.password || "",
        bonus: supplier.bonus?.toString() || "",
        category: supplier.category || "",
        active: supplier.active ? "true" : "false",
        isPremium: supplier.isPremium ? "true" : "false",
        customText: supplier.customText || "",
      });
    }
  }, [supplier, reset]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (mode === "add") {
      addNewSupplier(
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
      const updatedFields: Record<string, any> = { uuid: supplier?.uuid };
      if (data.bonus !== supplier?.bonus?.toString()) {
        updatedFields.bonus = data.bonus;
      }
      if (data.category !== supplier?.category) {
        updatedFields.category = data.category;
      }
      if (data.active !== (supplier?.active ? "true" : "false")) {
        updatedFields.active = data.active;
      }
      if (data.isPremium !== (supplier?.isPremium ? "true" : "false")) {
        updatedFields.isPremium = data.isPremium;
      }
      if (data.password && data.password !== supplier?.password) {
        updatedFields.password = data.password;
      }
      if (data.customText !== supplier?.customText) {
        updatedFields.customText = data.customText;
      }

      const updatedData = {
        data: updatedFields,
        token,
      };

      updateSupplier(updatedData, {
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
            {mode !== "add" && (
              <>
                <LabelInputContainer>
                  <Label>Bonus</Label>
                  <FormField
                    control={form.control}
                    name="bonus"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter Bonus"
                            {...field}
                            disabled={isViewMode}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </LabelInputContainer>

                <LabelInputContainer className="mb-1">
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
                                  supplier?.category || "Select Category"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectGroup>
                                <SelectLabel>Select Category</SelectLabel>
                                {supplierCategory.map((status) => (
                                  <SelectItem
                                    key={status.value}
                                    value={status.value}
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

                <LabelInputContainer className="mb-1">
                  <Label htmlFor="active" className="dark:text-farmacieGrey">
                    Status
                  </Label>
                  <FormField
                    control={form.control}
                    name="active"
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
                                className="text-black"
                                placeholder={
                                  supplier?.active ? "true" : "Select Status"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectGroup>
                                <SelectLabel>Select status</SelectLabel>
                                {supplierActiveVal.map((status) => (
                                  <SelectItem
                                    key={status.value}
                                    value={status.value}
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

                <LabelInputContainer className="mb-1">
                  <Label htmlFor="isPremium" className="dark:text-farmacieGrey">
                    Premium
                  </Label>
                  <FormField
                    control={form.control}
                    name="isPremium"
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
                                className="text-black"
                                placeholder={
                                  supplier?.isPremium
                                    ? "true"
                                    : !supplier?.isPremium
                                    ? "false"
                                    : "Mark Premium"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectGroup>
                                <SelectLabel>Select status</SelectLabel>
                                {supplierActiveVal.map((status) => (
                                  <SelectItem
                                    key={status.value}
                                    value={status.value}
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

                {form.watch("isPremium") === "true" && (
                  <LabelInputContainer className="mb-1">
                    <Label htmlFor="customText">Custom Text</Label>
                    <FormField
                      control={form.control}
                      name="customText"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              disabled={isViewMode}
                              placeholder="Enter custom text"
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
                )}
              </>
            )}
            <LabelInputContainer>
              <Label htmlFor="full_name">Username</Label>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={mode !== "add"}
                        placeholder="Username"
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
              <Label>Country Code</Label>
              <FormField
                control={form.control}
                name="countryCode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={mode !== "add"}
                        placeholder="+92"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label>Phone</Label>
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={mode !== "add"}
                        placeholder="3123456789"
                        type="tel"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="password">Password</Label>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        id="password"
                        disabled={isViewMode}
                        className="outline-none focus:border-primary"
                        {...field}
                      />
                    </FormControl>
                    {!showPassword ? (
                      <Icon
                        name="Eye"
                        size={18}
                        className={cn(
                          "absolute right-3.5 -translate-y-1/2 cursor-pointer text-gray-400",
                          !!form.formState.errors.password
                            ? "top-[20%]"
                            : "top-[32%]"
                        )}
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    ) : (
                      <Icon
                        name="EyeOff"
                        size={20}
                        className={cn(
                          "absolute right-3.5 -translate-y-1/2 cursor-pointer text-gray-400",
                          !!form.formState.errors.password
                            ? "top-[20%]"
                            : "top-[32%]"
                        )}
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </LabelInputContainer>
            {mode === "add" && (
              <LabelInputContainer className="mb-4">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type={confirmShowPassword ? "text" : "password"}
                          id="confirmPassword"
                          className="outline-none focus:border-primary"
                          {...field}
                        />
                      </FormControl>
                      {!confirmShowPassword ? (
                        <Icon
                          name="Eye"
                          size={18}
                          className={cn(
                            "absolute right-3.5 -translate-y-1/2 cursor-pointer text-gray-400",
                            !!form.formState.errors.password
                              ? "top-[20%]"
                              : "top-[20%]"
                          )}
                          onClick={() =>
                            setConfirmShowPassword(!confirmShowPassword)
                          }
                        />
                      ) : (
                        <Icon
                          name="EyeOff"
                          size={20}
                          className={cn(
                            "absolute right-3.5 -translate-y-1/2 cursor-pointer text-gray-400",
                            !!form.formState.errors.password
                              ? "top-[20%]"
                              : "top-[20%]"
                          )}
                          onClick={() =>
                            setConfirmShowPassword(!confirmShowPassword)
                          }
                        />
                      )}
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
            disabled={isViewMode || loading || updating}
          >
            {mode === "add" ? "Create" : "Update"}
          </Button>
          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent mt-6 h-[1px] w-full" />
        </form>
      </Form>
    </>
  );
};

export default AddSupplierForm;
