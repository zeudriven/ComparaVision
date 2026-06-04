import type { Metadata } from "next";
import { Courier_Prime, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";

const courierPrime = Courier_Prime({
  variable: "--font-courier-prime",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const pressStart2P = Press_Start_2P({
  variable: "--font-press-start-2p",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "ComparaVision - YOLO & Vision Model Comparison Platform",
  description: "Upload, compare, and analyze YOLO and vision models with side-by-side analysis and carbon-aware metrics",
  keywords: "YOLO, computer vision, model comparison, machine learning, AI, model analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${courierPrime.variable} ${pressStart2P.variable} antialiased min-h-screen bg-gray-50 dark:bg-gray-900`}
      >
        <Nav />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
