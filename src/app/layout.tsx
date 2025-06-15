import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import TRPCProvider from "./api/trpc/_trpc/trpc-provider";

import "./globals.css";

const poppins = Poppins({
  weight: ["300", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Manage you tasks smoothly",
};

export interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<LayoutProps>) {
  const baseURL = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <body className={`${poppins.className} antialiased bg-background/50`}>
          <TRPCProvider baseURL={baseURL}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </TRPCProvider>
        </body>
      </html>
    </>
  );
}
