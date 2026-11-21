import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import { ConvexAuthNextjsServerProvider } from "@/lib/convexAuth";
import { ThemeProvider } from "@/components/theme-provider";

import { Inter } from "next/font/google";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

import { cn } from "@/lib/utils";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Convex app",
  description: "Fullstack Convex app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(inter.variable, "font-sans", inter.variable)}
    >
      {/* <body className={`${inter.variable} min-h-[calc(100vh-2rem)] flex flex-col gap-4 antialiased`}> */}
      <body className="min-h-[calc(100vh-2rem)] flex flex-col gap-4 antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense>
            <ConvexAuthNextjsServerProvider>
              <Navbar />
              <main className="px-2 md:px-4 grow flex flex-col">
                {children}
              </main>
            </ConvexAuthNextjsServerProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
