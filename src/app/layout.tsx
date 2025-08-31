import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import GlassBackground from "../components/GlassBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Board the Z",
  description: "Let's get you onboarded",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          background: `linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)`,
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          width: "100vw",
          overflowX: "hidden"
        }}
      >
        <GlassBackground />
        <Navbar />
        <main style={{ width: "100%" }}>{children}</main>
      </body>
    </html>
  );
}
