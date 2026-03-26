import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Financial Intelligence Agent — Powered by Tavily & Arcade",
  description:
    "AI-powered pre-market intelligence: research companies, analyze markets, create briefings, and share to Slack. Built with Tavily search and Arcade MCP Gateway.",
  openGraph: {
    title: "Financial Intelligence Agent",
    description:
      "Pre-market intelligence powered by Tavily search and Arcade MCP Gateway. Research, analyze, and act — all in one conversation.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
