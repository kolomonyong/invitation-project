// src/app/layout.tsx
import type { Metadata } from "next";
import { Caladea, Lato, Bebas_Neue, Lexend_Deca } from "next/font/google"; // <-- IMPORT FONTS
import "./globals.css";
import { Toaster } from 'react-hot-toast';


// --- vvv CONFIGURE THE FONTS vvv ---
const caladea = Caladea({ 
  subsets: ["latin"],
  weight: ['400', '700'],
  variable: '--font-caladea', // This creates a CSS variable
});

const lato = Lato({
  subsets: ["latin"],
  weight: ['400', '700'],
  variable: '--font-lato', // This creates another CSS variable
});

const bebas_neue = Bebas_Neue({
  subsets: ["latin"],
  weight: ['400'],
  variable: '--font-bebas-neue',
});

const lexendDeca = Lexend_Deca({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-lexend-deca',
});
// --- ^^^ CONFIGURE THE FONTS ^^^ ---

export const metadata: Metadata = {
  title: "Digital Invitations – Create & Share Beautiful Invitations",
  description: "Create and share beautiful digital invitations for weddings, birthdays, and every special moment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Apply the font variables to the body tag
  return (
    <html lang="en">
      <body className={`${caladea.variable} ${lato.variable} ${bebas_neue.variable} ${lexendDeca.variable}`}>
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}