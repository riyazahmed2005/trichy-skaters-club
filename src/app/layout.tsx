import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Trichy Skaters - Roller Skating Club",
  description: "Official community portal of Trichy Skaters Roller Skating Club. Read news, achievements, view gallery images, and join upcoming events.",
  keywords: ["skating", "trichy", "roller skating", "speed skating", "club", "sports"],
  openGraph: {
    title: "Trichy Skaters - Roller Skating Club",
    description: "Official community portal of Trichy Skaters Roller Skating Club. Speed skating, training, achievements and gallery.",
    url: "https://trichyskaters.com",
    siteName: "Trichy Skaters",
    images: [
      {
        url: "/logo.jpg",
        width: 600,
        height: 600,
        alt: "Trichy Skaters Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} font-sans bg-[#0b0c10] text-[#c5c6c7] min-h-screen flex flex-col antialiased`}>
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
