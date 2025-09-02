/**
 * Root layout component for Board the Z application
 * Provides global styling, navigation, and toast notifications
 * 
 * This layout wraps all pages and includes:
 * - Global font configuration (Geist Sans & Mono)
 * - Gradient background styling
 * - Navigation bar
 * - Glass morphism background effect
 * - Toast notification system
 * 
 * @component RootLayout
 * @author Board the Z Team
 * @version 1.0.0
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navigation/Navbar";
import GlassBackground from "../components/GlassBackground";
import { ToastProvider, ToastContainer } from "../components/Toast";

/**
 * Primary font configuration using Geist Sans
 * Optimized for readability and modern appearance
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * Monospace font configuration using Geist Mono
 * Used for code displays and fixed-width text
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Application metadata for SEO and browser display
 */
export const metadata: Metadata = {
  title: "Board the Z",
  description: "Let's get you onboarded",
};

/**
 * Root layout props interface
 */
interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * Root layout component that wraps all application pages
 * 
 * Provides the foundational structure including:
 * - HTML document structure with proper lang attribute
 * - Font variable CSS custom properties
 * - Gradient background styling
 * - Glass morphism background component
 * - Global navigation
 * - Toast notification system
 * 
 * @param props - Layout props containing child components
 * @param props.children - Child components to render within the layout
 * @returns Complete HTML document structure
 */
export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          // Gradient background spanning the full viewport
          background: `linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)`,
          margin: 0,
          padding: 0,
          minHeight: "100vh", // Ensure full viewport height
          width: "100vw",     // Full viewport width
          overflowX: "hidden" // Prevent horizontal scroll
        }}
      >
        {/* Toast notification provider wraps entire app for global access */}
        <ToastProvider>
          {/* Glass morphism background effect */}
          <GlassBackground />
          
          {/* Global navigation bar */}
          <Navbar />
          
          {/* Main content area - all page content renders here */}
          <main style={{ width: "100%" }}>
            {children}
          </main>
          
          {/* Toast notification container for displaying messages */}
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  );
}
