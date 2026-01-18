"use client";
import React, { useState } from "react";
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
import { Icon } from "../ui/icon";
import LabelInputContainer from "./LabelInputContainer";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAccountFormSchema } from "@/schemas/FormsValidation";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useUserLogin } from "@/hooks/apis/useUserAuth";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { mutate: userLogin, isPending: loading } = useUserLogin();

  const form = useForm<z.infer<typeof loginAccountFormSchema>>({
    resolver: zodResolver(loginAccountFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof loginAccountFormSchema>) => {
    userLogin(data);
  };

  return (
    <>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="rounded-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-medium">Welcome back</CardTitle>
            <CardDescription>Login with your Google account</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="py-3" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-5">
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full"
                    onClick={() =>
                      signIn("google", { callbackUrl: "/dashboard/overiew" })
                    }
                  >
                    <Image
                      width={1000}
                      height={1000}
                      src="/images/google.svg"
                      alt="logo"
                      className="w-6 mr-2.5"
                    />
                    Login with Google
                  </Button>
                  <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                  <div className="grid gap-5">
                    <LabelInputContainer>
                      <Label htmlFor="username">Username</Label>
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Enter username"
                                type="text"
                                id="username"
                                className="outline-none focus:border-primary"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </LabelInputContainer>
                    <div className="grid gap-2">
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
                    </div>
                    <Button type="submit" className="w-full">
                      {loading ? "Logging..." : "Login"}
                    </Button>
                  </div>
                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/create-account"
                      className="underline underline-offset-4"
                    >
                      Create Account
                    </Link>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent mt-6 h-[1px] w-full" />
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
