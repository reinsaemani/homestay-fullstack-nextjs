import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { LocaleProvider } from "@/context/LocaleContext";
import SessionProviderWrapper from "@/components/auth/SessionProviderWrapper";
import HtmlLang from "@/components/common/HtmlLang";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bee Nirwana Homestay",
  description: "Experience the beauty of nature at our homestay",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <SessionProviderWrapper>
          <LocaleProvider>
            <ThemeProvider>
              <SidebarProvider>
                {children}
                <HtmlLang />
              </SidebarProvider>
            </ThemeProvider>
          </LocaleProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
