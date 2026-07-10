import SignInForm from "@/features/auth/components/SignInForm";
import type { Metadata } from "next";
import React, { Suspense } from "react";
import { getDictionary, hasLocale, defaultLocale } from "@/dictionaries";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const localeVal = cookieStore.get("locale")?.value || defaultLocale;
  const locale = hasLocale(localeVal) ? localeVal : defaultLocale;
  const dict = await getDictionary(locale);
  return {
    title: `${dict.auth.signIn.title} - Bee Nirwana Homestay`,
    description: dict.auth.signIn.subtitle,
  };
}

export default async function SignIn() {
  const cookieStore = await cookies();
  const localeVal = cookieStore.get("locale")?.value || defaultLocale;
  const locale = hasLocale(localeVal) ? localeVal : defaultLocale;
  const dict = await getDictionary(locale);

  return (
    <Suspense fallback={<div>{dict.common.loading}</div>}>
      <SignInForm />
    </Suspense>
  );
}
