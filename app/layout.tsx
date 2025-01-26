"use client";

import dynamic from "next/dynamic";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const WalletProvider = dynamic(
  () => import("@/providers/WalletProvider").then((m) => m.WalletProvider),
  {
    ssr: false,
  }
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" reverseOrder={false} />
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
