import type { Metadata } from "next";
import "./globals.css";
import TanStackProvider from "@/components/providers/TanStackProvider";
import { Toaster } from "@/components/ui/toaster";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "App",
  description: "Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <head>
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet' />
      </head>
      <body>
        <TanStackProvider>
          {children}
          <Toaster richColors position="top-center" closeButton dir="rtl" />
        </TanStackProvider>
      </body>
    </html>
  );
}
