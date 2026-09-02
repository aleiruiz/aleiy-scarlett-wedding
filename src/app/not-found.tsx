import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <div>
        <p className="eyebrow">Alei & Scarlett</p>
        <h1>Este enlace no está disponible</h1>
        <p>
          La invitación pudo haber vencido o el enlace está incompleto. Revisa
          el mensaje que recibiste por WhatsApp o comunícate con nosotros.
        </p>
        <Link className="button button-primary" href="/">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
