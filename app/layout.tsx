import type { Metadata } from "next";
import "./globals.css";
import TanStackProvider from "@/components/providers/TanStackProvider";

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
    <html lang="en">
      <body>
        <TanStackProvider>{children}</TanStackProvider>
      </body>
    </html>
  );
}
