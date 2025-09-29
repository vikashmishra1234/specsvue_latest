import type { Metadata } from "next";
import "./globals.css";
import Header from "@/app/components/Header";
import ReduxProvider from "./ReduxProvider";
import SessionWrapper from "./SessionWrapper";
import Script from "next/script";
import Footer from "./components/Home/Footer";

export const metadata: Metadata = {
  title: "SpecsVue | Eyeglasses, Sunglasses & Contact Lenses Online",
  description:
    "Shop high-quality eyeglasses, sunglasses, kids' glasses, and contact lenses at SpecsVaue. Affordable prices, modern styles, and prescription-ready frames.",
  keywords: [
    "SpecsVue",
    "eyeglasses online",
    "sunglasses",
    "contact lenses",
    "kids glasses",
    "affordable eyewear",
  ],
  authors: [{ name: "SpecsVue" }],
  openGraph: {
    title: "SpecsVue | Eyewear for Everyone",
    description:
      "Discover SpecsVue's collection of eyeglasses, sunglasses, and contact lenses. Stylish, durable, and budget-friendly eyewear for all.",
    url: "https://specsvaue.com",
    siteName: "SpecsVue",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpecsVue | Affordable Eyewear",
    description:
      "Shop eyeglasses, sunglasses, and contact lenses online with SpecsVaue. Fashionable frames at the best prices.",
    creator: "@specsaue",
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
