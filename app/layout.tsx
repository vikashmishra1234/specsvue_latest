import type { Metadata } from "next";
import "./globals.css";
import Header from "@/app/components/Header";
import ReduxProvider from "./ReduxProvider";
import SessionWrapper from "./SessionWrapper";
import Script from "next/script";
import Footer from "./components/Home/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://specsvue.in"),
  title: "SpecsVue | Eyeglasses, Sunglasses & Contact Lenses Online in Mathura",
  description:
    "Buy high-quality eyeglasses, sunglasses, kids' glasses, and contact lenses at SpecsVue Mathura. Affordable prices, prescription-ready eyewear, and trendy frames.",
  keywords: [
    "SpecsVue",
    "eyeglasses Mathura",
    "sunglasses Mathura",
    "contact lenses Mathura",
    "kids glasses online",
    "affordable eyewear India",
    "prescription glasses Mathura",
  ],
  authors: [{ name: "SpecsVue" }],
  openGraph: {
    title: "SpecsVue | Eyewear for Everyone",
    description:
      "Discover SpecsVue's collection of eyeglasses, sunglasses, and contact lenses in Mathura. Stylish, durable, and budget-friendly eyewear for all ages.",
    url: "https://specsvue.in",
    siteName: "SpecsVue",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/favicon.ico", // add an OG image (1200x630px)
        width: 1200,
        height: 630,
        alt: "SpecsVue - Eyeglasses, Sunglasses & Contact Lenses",
      },
    ],
  },
  alternates: {
    canonical: "https://specsvue.in",
  },
  icons: {
    icon: "/favicon.ico",
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Razorpay Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="beforeInteractive"
      />
      <body className="antialiased bg-white text-gray-900">
        <SessionWrapper>
          <ReduxProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </ReduxProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
