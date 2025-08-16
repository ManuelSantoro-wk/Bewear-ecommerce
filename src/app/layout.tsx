import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Footer from "@/components/common/footer";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "@/providers/react-query";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BEWEAR",
  description: "BEWEAR Store",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col bg-slate-50 antialiased`}
      >
        <ReactQueryProvider>
          {/* Wrapper com flex-grow que empurra o footer */}
          <div className="flex min-h-screen flex-col">
            <main className="flex-grow">{children}</main>
            {/* Footer sempre fora do children */}
            <Footer />
          </div>
        </ReactQueryProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
