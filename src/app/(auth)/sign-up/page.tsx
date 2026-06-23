"use client";

import { Suspense } from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { GoogleButton } from "@/components/auth/google-button";
import { Divider } from "@/components/ui/divider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Loader2, ShoppingCart, Store } from "lucide-react";
import type { UserRole } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["SUPERMARKET", "PRODUCT_OWNER"]),
});
type FormData = z.infer<typeof schema>;

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("auth.signUp");
  const defaultRole = (searchParams.get("role") as UserRole) || "PRODUCT_OWNER";
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: defaultRole },
  });

  const selectedRole = form.watch("role");

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await api.post("/auth/register", data);
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (res?.error) throw new Error("Auto sign-in failed");
      toast.success(t("success"));
      router.push("/dashboard");
    } catch {
      toast.error(t("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-brand-navy mb-1">{t("title")}</h1>
      <p className="text-sm text-muted-foreground mb-6">{t("subtitle")}</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <Label>{t("iAm")}</Label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  {([
                    { value: "PRODUCT_OWNER", label: t("productOwner"), icon: ShoppingCart,
                      active: "border-brand-green bg-brand-green/5 text-brand-green" },
                    { value: "SUPERMARKET",   label: t("supermarket"),   icon: Store,
                      active: "border-brand-orange bg-brand-orange/5 text-brand-orange" },
                  ] as const).map(({ value, label, icon: Icon, active }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => field.onChange(value)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-medium ${
                        field.value === value ? active : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      <Icon size={22} />
                      {label}
                    </button>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <GoogleButton label="Sign up with Google" role={selectedRole} />
          <Divider />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Label>{t("fullName")}</Label>
                <FormControl>
                  <Input placeholder="Jane Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label>{t("email")}</Label>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <Label>{t("password")}</Label>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-navy hover:bg-brand-navy-light"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("submitting")}
              </>
            ) : (
              t("submit")
            )}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        {t("haveAccount")}{" "}
        <Link href="/sign-in" className="text-brand-green font-medium hover:underline">
          {t("signInLink")}
        </Link>
      </p>
    </>
  );
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
}
