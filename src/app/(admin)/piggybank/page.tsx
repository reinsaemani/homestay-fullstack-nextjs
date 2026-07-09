import type { Metadata } from "next";
import React from "react";
import { cookies } from "next/headers";

import {
  defaultLocale,
  getDictionary,
  hasLocale,
} from "@/dictionaries";

import PiggyBankPageClient from "./PiggyBankPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const localeVal = cookieStore.get("locale")?.value || defaultLocale;
  const locale = hasLocale(localeVal) ? localeVal : defaultLocale;
  const dict = await getDictionary(locale);

  return {
    title: dict.piggyBank.title,
    description: dict.piggyBank.description,
  };
}

export default async function PiggyBankPage() {
  return <PiggyBankPageClient />;
}