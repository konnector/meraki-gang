import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Playfair_Display } from 'next/font/google';
import { DM_Serif_Text } from 'next/font/google';
import { Heebo } from 'next/font/google';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

const dmSerifText = DM_Serif_Text({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-dm-serif',
});

const heebo = Heebo({
  subsets: ['latin'],
  variable: '--font-heebo',
});

export const metadata: Metadata = {
  title: "Meraki AI - Your AI Assistant",
  description: "Ask anything and get intelligent answers powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${dmSerifText.variable} ${heebo.variable} antialiased bg-white`}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${dmSerifText.variable} ${heebo.variable} antialiased bg-white`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
