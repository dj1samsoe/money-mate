import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import RootProviders from "@/components/providers/RootProvider";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

const DMSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "MoneyMate | Managing Money Made Easy",
  description:
    "MoneyMate is a personal finance management tool that helps you track your expenses and income.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  return (
    <ClerkProvider afterSignOutUrl={"/sign-in"}>
      <html lang={locale} suppressHydrationWarning>
        <body className={DMSans.className}>
          <Toaster
            toastOptions={{
              duration: 3000,
            }}
          />
          <RootProviders>
            <NextIntlClientProvider messages={messages}>
              {children}
            </NextIntlClientProvider>
          </RootProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
