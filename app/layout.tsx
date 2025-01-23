"use client";

import dynamic from "next/dynamic";
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
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
