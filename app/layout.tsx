import type { Metadata } from "next";
import "./globals.css";
import TanStackProvider from "@/components/providers/TanStackProvider";
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
      <body>
        <TanStackProvider>{children}</TanStackProvider>
      </body>
    </html>
  );
}
