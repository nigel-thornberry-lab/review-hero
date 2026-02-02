import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Review Hero - Get More Reviews, Stop Bad Ones, Collect Referrals",
  description:
    "The review collection tool that actually works. Intercept bad reviews, push 5-star reviews to Google, and collect referrals automatically.",
  keywords: [
    "review management",
    "google reviews",
    "testimonials",
    "referrals",
    "reputation management",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
