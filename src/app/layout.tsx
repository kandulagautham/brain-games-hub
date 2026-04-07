import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400"],
});

const vt323 = VT323({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "BRAIN_GAMES_HUB // TERMINAL_v1.0",
  description: "A digital space for ADHD-friendly focus and stress relief games with a retro-futuristic aesthetic.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${pressStart2P.variable} ${vt323.variable} h-full antialiased font-body`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground relative">
        <div className="crt-overlay" />
        {children}
      </body>
    </html>
  );
}
