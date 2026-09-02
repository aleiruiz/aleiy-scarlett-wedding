import {
  ArrowDown,
  CalendarDays,
  Clock3,
  Gift,
  Heart,
  MapPin,
  MessageCircle,
  Shirt,
  Sparkles,
} from "lucide-react";
import { wedding } from "@/content/wedding";
import type { Invitation } from "@/types/invitation";
import { BotanicalDivider } from "./BotanicalDivider";
import { Countdown } from "./Countdown";
import { EnvelopeReveal } from "./EnvelopeReveal";
import { FloralSideOrnaments } from "./FloralSideOrnaments";
import { RsvpForm } from "./RsvpForm";
import { ScrollReveal } from "./ScrollReveal";

export function WeddingInvitation({
  invitation,
}: {
  invitation: Invitation;
}) {
  return (
    <main>
      <EnvelopeReveal groupName={invitation.groupName} />
      <ScrollReveal />

      <header className="hero" id="inicio">
        <nav className="nav" aria-label="Navegación principal">
          <a className="monogram" href="#inicio" aria-label="Volver al inicio">
            {wedding.couple.initials}
          </a>
          <div className="nav-links">
            <a href="#detalles">Detalles</a>
            <a href="#itinerario">Itinerario</a>
            <a href="#galeria">Galería</a>
            <a className="nav-rsvp" href="#confirmar">
              Confirmar
            </a>
          </div>
        </nav>

        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-eyebrow">{wedding.hero.eyebrow}</p>
          <h1>
            <span>{wedding.couple.first}</span>
            <span className="ampersand">&</span>
            <span>{wedding.couple.second}</span>
          </h1>
          <div className="hero-rule" />
          <p className="hero-date">{wedding.date.display}</p>
          <p className="hero-location">{wedding.location}</p>
        </div>

        <a className="scroll-cue" href="#bienvenida" aria-label="Ver invitación">
          <span>Descubre nuestra invitación</span>
          <ArrowDown size={18} aria-hidden="true" />
        </a>
      </header>

      <div className="welcome-stage" id="bienvenida">
        <section className="welcome section" data-reveal="up">
          <FloralSideOrnaments variant="blossoms" />
          <div className="ornament" aria-hidden="true">
            <span />
            <Heart size={18} />
            <span />
          </div>
          <p className="eyebrow">Invitación especial para</p>
          <h2>{invitation.groupName}</h2>
          <BotanicalDivider />
          <p className="welcome-message">{invitation.greeting}</p>
          <div className="guest-names">
            {invitation.guests.map((guest) => (
              <span key={guest.id}>{guest.name}</span>
            ))}
          </div>
          <p className="passes">
            {invitation.maxPasses}{" "}
            {invitation.maxPasses === 1
              ? "pase reservado"
              : "pases reservados"}
          </p>
        </section>
      </div>

      <section className="countdown-section">
        <div data-reveal="left">
          <p className="eyebrow light">Falta muy poco</p>
          <h2>Para nuestro gran día</h2>
        </div>
        <div data-reveal="right" data-delay="1">
          <Countdown target={wedding.date.iso} />
        </div>
      </section>

      <section className="story section">
        <div
          className="story-photo"
          role="img"
          aria-label="Pareja caminando en el campo"
          data-reveal="left"
        >
          <div className="photo-frame-text">Siempre tú</div>
        </div>
        <div className="story-copy" data-reveal="right" data-delay="1">
          <p className="eyebrow">El comienzo de siempre</p>
          <h2>{wedding.story.title}</h2>
          <BotanicalDivider />
          {wedding.story.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="signature">{wedding.couple.initials}</p>
        </div>
      </section>

      <section
        className="gallery-section"
        id="galeria"
        aria-labelledby="galeria-titulo"
      >
        <div className="gallery-heading" data-reveal="up">
          <p className="eyebrow">Nuestros momentos</p>
          <h2 id="galeria-titulo">Lo mejor está por venir</h2>
          <BotanicalDivider />
          <p>
            Coleccionamos recuerdos, aventuras y muchas razones para elegirnos
            todos los días.
          </p>
        </div>
        <div className="photo-gallery">
          <div
            className="gallery-photo gallery-one"
            role="img"
            aria-label="Pareja abrazándose al atardecer"
            data-reveal="scale"
          />
          <div
            className="gallery-photo gallery-two"
            role="img"
            aria-label="Detalle de manos entrelazadas"
            data-reveal="scale"
            data-delay="1"
          />
          <div className="gallery-quote" data-reveal="up" data-delay="2">
            <Heart size={22} strokeWidth={1.2} aria-hidden="true" />
            <p>Contigo, todos los caminos se sienten como casa.</p>
            <span>{wedding.couple.initials}</span>
          </div>
          <div
            className="gallery-photo gallery-three"
            role="img"
            aria-label="Pareja caminando entre árboles"
            data-reveal="scale"
            data-delay="2"
          />
          <div
            className="gallery-photo gallery-four"
            role="img"
            aria-label="Pareja celebrando junta"
            data-reveal="scale"
            data-delay="1"
          />
        </div>
      </section>

      <section className="details section with-side-florals" id="detalles">
        <FloralSideOrnaments variant="wildflowers" />
        <div className="section-heading" data-reveal="up">
          <p className="eyebrow">Dónde y cuándo</p>
          <h2>Detalles de la celebración</h2>
          <BotanicalDivider />
          <p>Sábado · {wedding.date.display}</p>
        </div>
        <div className="event-grid">
          {wedding.events.map((event, index) => (
            <article
              className="event-card"
              key={event.type}
              data-reveal="up"
              data-delay={index + 1}
            >
              <span className="event-number">0{index + 1}</span>
              <span className="icon-medallion">
                <MapPin size={23} strokeWidth={1.35} aria-hidden="true" />
              </span>
              <p className="eyebrow">{event.type}</p>
              <h3>{event.venue}</h3>
              <p className="event-time">{event.time}</p>
              <p>{event.address}</p>
              <a
                className="text-link"
                href={event.mapUrl}
                target="_blank"
                rel="noreferrer"
              >
                Abrir en Google Maps
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="schedule-section" id="itinerario">
        <div
          className="schedule-photo"
          aria-hidden="true"
          data-reveal="left"
        />
        <div className="schedule-content" data-reveal="right">
          <p className="eyebrow light">Celebremos juntos</p>
          <h2>Itinerario</h2>
          <BotanicalDivider light />
          <div className="timeline">
            {wedding.schedule.map((item, index) => (
              <div
                className="timeline-item"
                key={item.time}
                data-reveal="up"
                data-delay={(index % 3) + 1}
              >
                <span className="timeline-icon">
                  <Clock3 size={17} strokeWidth={1.4} aria-hidden="true" />
                </span>
                <span>{item.time}</span>
                <p>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="info-pair section">
        <article className="info-card attire-card" data-reveal="left">
          <span className="icon-medallion">
            <Shirt size={25} strokeWidth={1.25} aria-hidden="true" />
          </span>
          <p className="eyebrow">Para lucir increíble</p>
          <h2>{wedding.attire.title}</h2>
          <BotanicalDivider />
          <h3>{wedding.attire.style}</h3>
          <p>{wedding.attire.note}</p>
          <div className="palette" aria-label="Paleta de colores reservados">
            <span className="swatch ivory" title="Marfil" />
            <span className="swatch white" title="Blanco" />
            <span className="swatch sage" title="Verde salvia" />
          </div>
        </article>

        <article
          className="info-card gift-card"
          data-reveal="right"
          data-delay="1"
        >
          <span className="icon-medallion light">
            <Gift size={25} strokeWidth={1.25} aria-hidden="true" />
          </span>
          <p className="eyebrow">Con cariño</p>
          <h2>{wedding.gifts.title}</h2>
          <BotanicalDivider light />
          <p>{wedding.gifts.note}</p>
          <div className="gift-links">
            {wedding.gifts.links.map((link) => (
              <a
                className="button button-outline"
                href={link.url}
                target="_blank"
                rel="noreferrer"
                key={link.label}
              >
                {link.label}
              </a>
            ))}
          </div>
        </article>
      </section>

      <section className="faq section with-side-florals">
        <FloralSideOrnaments variant="leaves" />
        <div className="section-heading" data-reveal="up">
          <p className="eyebrow">Todo lo que necesitas saber</p>
          <h2>Preguntas frecuentes</h2>
          <BotanicalDivider />
        </div>
        <div className="faq-list">
          {wedding.faq.map((item, index) => (
            <details
              key={item.question}
              data-reveal="up"
              data-delay={(index % 3) + 1}
            >
              <summary>
                {item.question}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="rsvp-section" id="confirmar">
        <div className="rsvp-copy" data-reveal="left">
          <Sparkles size={28} strokeWidth={1.3} aria-hidden="true" />
          <p className="eyebrow light">Nos encantará verte</p>
          <h2>Confirma tu asistencia</h2>
          <BotanicalDivider light />
          <p>
            Ayúdanos a preparar cada detalle respondiendo antes del{" "}
            {wedding.date.rsvpDeadline}.
          </p>
          <CalendarDays size={52} strokeWidth={1} aria-hidden="true" />
        </div>
        <div className="rsvp-form-shell" data-reveal="right" data-delay="1">
          <RsvpForm invitation={invitation} />
        </div>
      </section>

      <footer>
        <div className="footer-map" data-reveal="up">
          <iframe
            src={wedding.venue.mapEmbedUrl}
            title={`Mapa de ${wedding.venue.name}`}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
          <div className="footer-location-card">
            <p className="eyebrow">Nos vemos en</p>
            <h2>{wedding.venue.name}</h2>
            <p>{wedding.venue.address}</p>
            <a
              className="text-link"
              href={wedding.venue.mapUrl}
              target="_blank"
              rel="noreferrer"
            >
              Abrir indicaciones
            </a>
          </div>
        </div>
        <div className="footer-content">
          <p className="footer-monogram">{wedding.couple.initials}</p>
          <p>{wedding.hero.note}</p>
          <a href={wedding.contact.whatsappUrl}>
            <MessageCircle size={17} aria-hidden="true" />
            {wedding.contact.label}
          </a>
          <p className="footer-date">{wedding.date.short}</p>
        </div>
      </footer>
    </main>
  );
}
