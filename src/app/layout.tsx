import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PlugToPlaylist - Premium Music Promotion Platform",
  description: "Get your music featured on top playlists across Spotify and YouTube. Professional promotion services trusted by thousands of artists worldwide.",
  keywords: ["music promotion", "playlist placement", "spotify promotion", "youtube promotion", "artist marketing", "music marketing"],
  authors: [{ name: "PlugToPlaylist Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "PlugToPlaylist - Premium Music Promotion",
    description: "Your gateway to playlist success. Get your music heard by millions.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PlugToPlaylist - Premium Music Promotion",
    description: "Your gateway to playlist success. Get your music heard by millions.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
