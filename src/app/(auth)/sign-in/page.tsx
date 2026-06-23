"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { GoogleButton } from "@/components/auth/google-button";
import { Divider } from "@/components/ui/divider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Loader2, ShoppingCart, Store } from "lucide-react";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormData = z.infer<typeof schema>;

export default function SignInPage() {
  const router = useRouter();
  const t = useTranslations("auth.signIn");
  const [loading, setLoading] = useState(false);
  const [googleRole, setGoogleRole] = useState<"PRODUCT_OWNER" | "SUPERMARKET">("PRODUCT_OWNER");

  const form = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const res = await signIn("credentials", { ...data, redirect: false });
    setLoading(false);
    if (res?.error) {
      toast.error(t("error"));
    } else {
      toast.success("Welcome back!");
      router.push("/dashboard");
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-brand-navy mb-1">{t("title")}</h1>
      <p className="text-sm text-muted-foreground mb-6">{t("subtitle")}</p>

      <div className="mb-3">
        <p className="text-xs font-medium text-gray-500 mb-2">I am a…</p>
        <div className="grid grid-cols-2 gap-3">
          {([
            { value: "PRODUCT_OWNER" as const, label: "Brand / Owner", icon: ShoppingCart,
              active: "border-brand-green bg-brand-green/5 text-brand-green" },
            { value: "SUPERMARKET"   as const, label: "Supermarket",   icon: Store,
              active: "border-brand-orange bg-brand-orange/5 text-brand-orange" },
          ]).map(({ value, label, icon: Icon, active }) => (
            <button
              key={value}
              type="button"
              onClick={() => setGoogleRole(value)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-medium ${
                googleRole === value ? active : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              <Icon size={22} />
              {label}
            </button>
          ))}
        </div>
      </div>
      <GoogleButton label="Continue with Google" role={googleRole} />
      <Divider />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          <Button type="submit" disabled={loading} className="w-full bg-brand-navy hover:bg-brand-navy-light">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t("submitting")}</> : t("submit")}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        {t("noAccount")}{" "}
        <Link href="/sign-up" className="text-brand-green font-medium hover:underline">
          {t("signUpLink")}
        </Link>
      </p>
    </>
  );
}
