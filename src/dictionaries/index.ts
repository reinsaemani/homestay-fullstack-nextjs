import id from "./id.json";
import en from "./en.json";

export type Locale = keyof typeof dictionaries;

const dictionaries = { id, en } as const;

export type Dictionary = (typeof dictionaries)[Locale];

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const defaultLocale: Locale = "id";

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale];
