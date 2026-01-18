import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "./Providers";
import QueryProvider from "@/query/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FreeEarn Admin",
  description: "FreeEarn Admin Portal to manage users",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "",
    title: "FreeEarn Admin",
    description: "FreeEarn Admin Portal to manage users",
    images: [
      {
        url: "",
        width: 1200,
        height: 630,
        alt: "FreeEarn Admin Portal to manage users",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <NextAuthProvider>{children}</NextAuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
