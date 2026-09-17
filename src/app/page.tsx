import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { wedding } from "@/content/wedding";
import { Monogram } from "@/components/wedding/Monogram";

export default function Home() {
  return (
    <main className="entry-page">
      <div className="entry-overlay" />
      <div className="entry-card">
        <p className="eyebrow light">Nuestra boda</p>
        <h1 aria-label="Alei y Scarlett">
          <Monogram tone="white" className="hero-monogram" />
        </h1>
        <p>{wedding.date.display}</p>
        <p className="entry-note">
          Cada invitación tiene un enlace privado. Abre el que recibiste por
          WhatsApp para ver tus pases y confirmar.
        </p>
        <Link
          className="button entry-button"
          href="/invitacion/demo-alei-scarlett-2026"
        >
          Ver invitación de muestra
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}
