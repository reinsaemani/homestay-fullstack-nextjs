"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";

export default function SignInForm() {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const maxAge = isChecked ? 86400 : 3600;
    const url = new URL(callbackUrl, window.location.origin);
    url.searchParams.set("maxAge", String(maxAge));

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: url.toString(),
    });

    if (result?.error) {
      setError(t.auth.signIn.invalidCredentials);
      setLoading(false);
    } else {
      localStorage.setItem("sessionStart", String(Date.now()));
      localStorage.setItem("sessionMaxAge", String(maxAge));
      router.push(callbackUrl);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            {t.auth.signIn.title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t.auth.signIn.subtitle}
          </p>
        </div>

        {/* <div className="relative py-3 sm:py-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white p-2 text-gray-400 dark:bg-gray-900 sm:px-5 sm:py-2">
              {t.auth.signIn.loginWithCredentials}
            </span>
          </div>
        </div> */}

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="space-y-6">
            {error && (
              <div className="rounded-lg bg-error-50 p-3 text-sm text-error-600 dark:bg-error-500/15 dark:text-error-500">
                {error}
              </div>
            )}
            <div>
              <Label>
                {t.auth.signIn.email} <span className="text-error-500">*</span>
              </Label>
              <Input
                name="email"
                type="email"
                placeholder={t.auth.signIn.emailPlaceholder}
                required
              />
            </div>
            <div>
              <Label>
                {t.auth.signIn.password} <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t.auth.signIn.passwordPlaceholder}
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox checked={isChecked} onChange={setIsChecked} />
                <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                  {t.auth.signIn.keepLoggedIn}
                </span>
              </div>
            </div>
            <div>
              <Button className="w-full" size="sm" disabled={loading}>
                {loading ? t.auth.signIn.signingIn : t.auth.signIn.signInButton}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
