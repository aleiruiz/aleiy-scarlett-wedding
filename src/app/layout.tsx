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
  metadataBase: new URL("https://aleiy-scarlett-wedding.vercel.app"),
  title: "Alei & Scarlett | Nuestra boda",
  description:
    "Acompáñanos a celebrar nuestra boda en Península Eventos, Santiago, Nuevo León.",
  icons: {
    icon: [
      { url: "/wedding-monogram.png", type: "image/png" },
    ],
    apple: "/wedding-monogram.png",
  },
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
      <body className="min-h-full flex flex-col">
        <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
          <defs>
            <filter id="monogram-gold" colorInterpolationFilters="sRGB">
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 -1 0 1" />
              <feComposite in2="SourceGraphic" operator="in" />
            </filter>
            <filter id="monogram-white" colorInterpolationFilters="sRGB">
              <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  -0.3189 -1.0728 -0.1083 0 1.5" />
              <feComposite in2="SourceGraphic" operator="in" />
            </filter>
          </defs>
        </svg>
        {children}
      </body>
    </html>
  );
}
