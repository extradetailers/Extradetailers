import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./custom-bootstrap.scss";
import "./globals.scss";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import QueryProvider from "@/lib/QueryProvider";
import ToastProvider from "@/lib/ToastProvider";
import MessageToast from "@/components/elements/MessageToast";

gsap.registerPlugin(useGSAP);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // <title>Professional Automobile Detailing Services</title>
  title: "Extra Detailers - Professional Automobile Detailing Services",
  description: "Experience top-notch complete detailing services for your vehicle with Extra Detailers. Our experts will make your car shine inside and out.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ToastProvider>
          <QueryProvider>
            <MessageToast /> {/*  Absolute position */}
            {children}
          </QueryProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
