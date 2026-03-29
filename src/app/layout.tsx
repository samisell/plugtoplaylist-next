import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

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
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}