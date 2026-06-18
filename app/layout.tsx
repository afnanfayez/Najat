import type { Metadata, Viewport } from "next";
import "./globals.css";
import 'boxicons/css/boxicons.min.css';
import TanStackProvider from "@/components/providers/TanStackProvider";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import PWARegister from "@/components/providers/PWARegister";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "منصة نجاة للطوارئ",
  description: "منصة نجاة للخدمات الإنسانية والطوارئ",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "نجاة",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#2496FF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={cn("font-sans", geist.variable)}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="نجاة" />
        <link rel="apple-touch-icon" href="/assets/najat-icon-512.png" />
      </head>
      <body>
        <PWARegister />
        <TanStackProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster richColors position="top-center" closeButton dir="rtl" />
        </TanStackProvider>
      </body>
    </html>
  );
}
