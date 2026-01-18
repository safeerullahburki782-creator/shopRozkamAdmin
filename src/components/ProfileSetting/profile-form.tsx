"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { passwordSchema, profileFormSchema } from "@/schemas/FormsValidation";
import { useContextConsumer } from "@/context/Context";
import { useEffect, useReducer, useState } from "react";
import {
  useGetUSerProfile,
  useUpdateUserAccountPassword,
  useUpdateUserProfile,
} from "@/hooks/apis/useUserAuth";
import { useSession } from "next-auth/react";
import { Pencil } from "lucide-react";
import LabelInputContainer from "../Forms/LabelInputContainer";
import { Label } from "../ui/label";
import { PhoneInput } from "../ui/PhoneInput";
import { APIResponseLoader } from "../ui/ResponseLoader";
import { Icon } from "../ui/icon";
import { cn } from "@/lib/utils";
import { StatusBadge } from "../badges/VerifiedStatus";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { role } from "@/constant/data";

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;
type PasswordVisibilityState = {
  oldPassword: boolean;
  newPassword: boolean;
  confirmPassword: boolean;
};

type Action =
  | { type: "TOGGLE_OLD" }
  | { type: "TOGGLE_NEW" }
  | { type: "TOGGLE_CONFIRM" };

const visibilityReducer = (
  state: PasswordVisibilityState,
  action: Action
): PasswordVisibilityState => {
  switch (action.type) {
    case "TOGGLE_OLD":
      return { ...state, oldPassword: !state.oldPassword };
    case "TOGGLE_NEW":
      return { ...state, newPassword: !state.newPassword };
    case "TOGGLE_CONFIRM":
      return { ...state, confirmPassword: !state.confirmPassword };
    default:
      return state;
  }
};

export default function ProfileForm() {
  const { token } = useContextConsumer();
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [showPasswordForm, setShowPasswordForm] = useState<boolean>(false);
  const [visibility, dispatch] = useReducer(visibilityReducer, {
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const { data: session } = useSession();

  const { data: apiUser, isLoading } = useGetUSerProfile(token);
  const { mutate: updateUser, isPending: updating } = useUpdateUserProfile();
  const { mutate: updatePassword } = useUpdateUserAccountPassword();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      countryCode: "",
      phone: "",
      role: "",
      verified: false,
      profileImg: null,
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (session?.user) {
      profileForm.reset({
        username: session.user.name || "",
        phone: "",
      });
    } else if (apiUser?.success && apiUser.data) {
      profileForm.reset({
        username: apiUser.data.username || "",
        phone: apiUser.data.phone || "",
        role: apiUser.data.role?.toLowerCase() || "",
        verified: apiUser.data.verified || false,
        profileImg: apiUser.data.profileImg || null,
      });
    }
  }, [session, apiUser, profileForm]);

  const onSubmitProfile = (data: ProfileFormValues) => {
    updateUser(
      { data, token },
      {
        onSuccess: () => {
          setIsEditable(false);
        },
      }
    );
  };

  const onSubmitPassword = (data: PasswordFormValues) => {
    updatePassword(
      { data, token },
      {
        onSuccess: () => {
          passwordForm.reset();
          setShowPasswordForm(false);
        },
      }
    );
  };

  return isLoading ? (
    <APIResponseLoader className="h-60 w-full col-span-3" />
  ) : (
    <div className="relative">
      <div className="flex justify-end mb-4">
        <Button
          size="sm"
          type="button"
          onClick={() => setIsEditable(!isEditable)}
          className="py-2 px-4"
        >
          {isEditable ? "Cancel" : "Edit"}
          {!isEditable && <Pencil className="w-3.5 h-3.5 ml-2" />}
        </Button>
      </div>

      {!isLoading && (
        <div className="flex flex-col gap-2 mb-12">
          <div className="relative">
            <img
              src={
                profileForm.watch("profileImg") ||
                "https://avatars.githubusercontent.com/u/124599?v=4"
              }
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border border-gray-300 shadow"
            />
            {isEditable && (
              <label className="absolute bottom-0 left-12 bg-primary p-1.5 rounded-full cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        profileForm.setValue(
                          "profileImg",
                          reader.result as string
                        );
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <Pencil className="w-3 h-3 text-white" />
              </label>
            )}
          </div>
          <LabelInputContainer>
            <div className="pt-3">
              <StatusBadge verified={profileForm.watch("verified")} />
            </div>
          </LabelInputContainer>
        </div>
      )}

      <Form {...profileForm}>
        <form
          onSubmit={profileForm.handleSubmit(onSubmitProfile)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
        >
          <LabelInputContainer>
            <Label htmlFor="username">Username</Label>
            <FormField
              control={profileForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter username"
                      type="text"
                      id="username"
                      disabled={!isEditable}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="phone">Phone Number</Label>
            <FormField
              control={profileForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PhoneInput
                      id="phone"
                      placeholder="Enter your phone number"
                      defaultCountry="PK"
                      disabled={!isEditable}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="role">Role</Label>
            <FormField
              control={profileForm.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                      disabled={!isEditable}
                    >
                      <SelectTrigger
                        className={cn(
                          "p-3 py-5 rounded-md border border-estateLightGray focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-primary/20"
                        )}
                      >
                        <SelectValue
                          placeholder={apiUser?.data?.role || "Select Role"}
                        />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectGroup>
                          <SelectLabel>Select Role</SelectLabel>
                          {role.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
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

          {/* <LabelInputContainer>
            <Label htmlFor="profileImg">Profile Image</Label>
            {profileForm.watch("profileImg") ? (
              <img
                src={profileForm.watch("profileImg")!}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <p className="text-muted-foreground text-sm">No image uploaded</p>
            )}
          </LabelInputContainer> */}

          {isEditable && (
            <div className="flex justify-end items-end">
              <Button type="submit">
                {updating ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          )}
        </form>
      </Form>

      {isEditable && (
        <div className="mt-6">
          <Button
            variant="secondary"
            type="button"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
          >
            {showPasswordForm ? "Hide Password Update" : "Change Password"}
          </Button>
        </div>
      )}

      {showPasswordForm && (
        <Form {...passwordForm}>
          <form
            onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
          >
            <LabelInputContainer>
              <Label htmlFor="oldPassword">Old Password</Label>
              <FormField
                control={passwordForm.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormControl>
                      <Input
                        placeholder="Enter old password"
                        type={visibility.oldPassword ? "text" : "password"}
                        id="oldPassword"
                        className="outline-none focus:border-primary"
                        {...field}
                      />
                    </FormControl>
                    <Icon
                      name={visibility.oldPassword ? "EyeOff" : "Eye"}
                      size={18}
                      className={cn(
                        "absolute right-3.5 -translate-y-1/2 cursor-pointer text-gray-400",
                        !!passwordForm.formState.errors.oldPassword
                          ? "top-[20%]"
                          : "top-[32%]"
                      )}
                      onClick={() => dispatch({ type: "TOGGLE_OLD" })}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="newPassword">New Password</Label>
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormControl>
                      <Input
                        placeholder="Enter new password"
                        type={visibility.newPassword ? "text" : "password"}
                        id="newPassword"
                        className="outline-none focus:border-primary"
                        {...field}
                      />
                    </FormControl>
                    <Icon
                      name={visibility.newPassword ? "EyeOff" : "Eye"}
                      size={18}
                      className={cn(
                        "absolute right-3.5 -translate-y-1/2 cursor-pointer text-gray-400",
                        !!passwordForm.formState.errors.newPassword
                          ? "top-[20%]"
                          : "top-[32%]"
                      )}
                      onClick={() => dispatch({ type: "TOGGLE_NEW" })}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormControl>
                      <Input
                        placeholder="Confirm new password"
                        type={visibility.confirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        className="outline-none focus:border-primary"
                        {...field}
                      />
                    </FormControl>
                    <Icon
                      name={visibility.confirmPassword ? "EyeOff" : "Eye"}
                      size={18}
                      className={cn(
                        "absolute right-3.5 -translate-y-1/2 cursor-pointer text-gray-400",
                        !!passwordForm.formState.errors.confirmPassword
                          ? "top-[20%]"
                          : "top-[32%]"
                      )}
                      onClick={() => dispatch({ type: "TOGGLE_CONFIRM" })}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </LabelInputContainer>

            <div className="flex justify-end col-span-full">
              <Button type="submit">Update Password</Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
