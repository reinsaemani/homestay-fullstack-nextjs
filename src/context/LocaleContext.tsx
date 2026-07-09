"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Dictionary, Locale } from "@/dictionaries";
import { defaultLocale } from "@/dictionaries";
import idDict from "@/dictionaries/id.json";
import enDict from "@/dictionaries/en.json";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
}

const dicts: Record<Locale, Dictionary> = { id: idDict, en: enDict };

const LocaleContext = createContext<LocaleContextType | null>(null);

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match?.[2];
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value};path=/;max-age=31536000;SameSite=Lax`;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [t, setT] = useState<Dictionary>(dicts[defaultLocale]);

  useEffect(() => {
    const stored = getCookie("locale") as Locale | undefined;
    if (stored && stored !== defaultLocale) {
      setLocaleState(stored);
      setT(dicts[stored]);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    setT(dicts[newLocale]);
    setCookie("locale", newLocale);
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextType {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
