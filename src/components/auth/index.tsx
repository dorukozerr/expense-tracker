"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { login, register } from "@/actions/auth";
import { authFormSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const AuthForm = () => {
  const [formType, setFormType] = useState<"login" | "register">("login");
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof authFormSchema>>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    form.reset();
  }, [formType, form]);

  const onSubmit = async (values: z.infer<typeof authFormSchema>) => {
    setIsPending(true);

    const res =
      formType === "login"
        ? await login(values)
        : formType === "register"
          ? await register(values)
          : null;

    toast(res?.message || "This should never seen.");

    setIsPending(false);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="h-max w-[300px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-full w-full flex-col items-start justify-start gap-4 rounded-md border border-border p-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="kawai" {...field} />
                  </FormControl>
                  <FormDescription>Please enter your username.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="**********"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Please enter your password.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending}>
              {formType === "login"
                ? "Login"
                : formType === "register"
                  ? "Register"
                  : null}
            </Button>
            {formType === "login" ? (
              <p className="text-sm">
                Don&apos;t have an account?{" "}
                <span
                  className="cursor-pointer underline"
                  onClick={() => setFormType("register")}
                >
                  Register
                </span>
              </p>
            ) : (
              <p className="text-sm">
                Already have an account?{" "}
                <span
                  className="cursor-pointer underline"
                  onClick={() => setFormType("login")}
                >
                  Login
                </span>
              </p>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};
