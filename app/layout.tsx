import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'POSA — Maîtriser le marché',
  description: 'Maîtrise du marché, simulation, indicateurs et assistant pour crypto.',
  
  metadataBase: new URL('https://posa.princejeanluc.work'),
  openGraph: {
    title: 'POSA — Maîtriser le marché',
    description: 'Maîtrise du marché, simulation, indicateurs et assistant pour crypto.',
    url: 'https://posa.princejeanluc.work',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: '/favicon.ico',                 // favicon classique
    apple: '/apple-touch-icon.png',       // iOS
    other: [
      { rel: 'icon', url: '/favicon-32x32.png', sizes: '32x32' },
      { rel: 'icon', url: '/favicon-16x16.png', sizes: '16x16' },
      { rel: 'manifest', url: '/site.webmanifest' }
    ]
  }
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
      >
        {children}
        <Toaster richColors position="top-right" /> 
      </body>
    </html>
  );
}
