import type { Metadata } from "next";
import { Raleway as FontSans } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";

import { Toaster } from "react-hot-toast";
import { NavDeposito } from "@/components/nav-deposito";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: "500",
});

export const metadata: Metadata = {
  title: "Bank Saving System",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <NavDeposito />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
