import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";

// Onest at the weights the hero uses: 400 headline, 500 labels/buttons, 600 card titles.
const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Ledgerly — Your AI-powered accounting firm",
  description:
    "Ledgerly is an AI-powered accounting firm: daily bookkeeping, reconciliation and forecasting for accounting and finance teams.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${onest.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
