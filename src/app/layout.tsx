import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Italiana,
  Montserrat,
  Parisienne,
} from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const italiana = Italiana({
  variable: "--font-title",
  subsets: ["latin"],
  weight: "400",
});

const parisienne = Parisienne({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Alei & Scarlett | Nuestra boda",
  description:
    "Acompáñanos a celebrar nuestra boda en Península Eventos, Santiago, Nuevo León.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Alei & Scarlett | Nuestra boda",
    description: "Una fecha, una promesa y todas nuestras personas favoritas.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-MX"
      className={`${cormorant.variable} ${montserrat.variable} ${italiana.variable} ${parisienne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
