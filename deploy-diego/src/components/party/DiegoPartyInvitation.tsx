import { CalendarDays, Clock3, MapPin, PartyPopper, PawPrint, Sparkles, Star } from "lucide-react";
import { diegoParty } from "@/content/diego-party";

export function DiegoPartyInvitation() {
  return (
    <main className="party-page">
      <header className="party-hero" id="inicio">
        <div className="party-sun" aria-hidden="true" />
        <div className="party-balloons" aria-hidden="true"><span /><span /><span /></div>
        <nav className="party-nav" aria-label="Navegación principal">
          <a href="#inicio" className="party-logo" aria-label="Inicio">DS</a>
          <a href="#detalles">Detalles</a>
        </nav>
        <div className="party-hero-content">
          <p className="party-kicker"><PawPrint size={17} aria-hidden="true" /> ¡Wackadoo!</p>
          <p className="party-pretitle">Estás invitado a celebrar</p>
          <h1>{diegoParty.child}</h1>
          <div className="party-age"><span>{diegoParty.age}</span><small>años</small></div>
          <p className="party-theme">Una aventura con temática de <strong>{diegoParty.theme}</strong></p>
          <a className="party-button party-button-light" href="#detalles">Ver los detalles <Sparkles size={17} aria-hidden="true" /></a>
        </div>
        <img className="party-hero-character" src="/resources/Bluey/birth.png" alt="Bluey y Bingo celebrando un cumpleaños" />
        <img className="party-hero-diego" src="/resources/Bluey/diego-hero-transparent-v2.png" alt="Diego Sae sonriendo" />
        <a className="party-scroll" href="#bienvenida">Desliza para descubrir <span>↓</span></a>
      </header>

      <section className="party-welcome" id="bienvenida">
        <div className="party-card party-welcome-card">
          <PawPrint className="party-paw" size={30} aria-hidden="true" />
          <p className="party-kicker">¡Hola, amigos!</p>
          <h2>Vamos a celebrar<br /><em>a lo grande</em></h2>
          <p>{diegoParty.note}</p>
          <div className="party-rainbow" aria-hidden="true"><span /><span /><span /><span /></div>
          <img className="party-welcome-image" src="/resources/Bluey/bluey-family-transparent.png" alt="Bluey, Bingo y su familia listos para celebrar" />
        </div>
      </section>

      <section className="party-moments" aria-labelledby="party-moments-title">
        <div className="party-section-heading">
          <p className="party-kicker">La pandilla está lista</p>
          <h2 id="party-moments-title">Una fiesta para recordar</h2>
          <p className="party-moments-intro">{diegoParty.favorites}</p>
        </div>
        <div className="party-moments-grid">
          <figure className="party-moment party-moment-tall">
            <img src="/resources/Bluey/bingo-xilofono-transparent.png" alt="Bingo tocando un xilófono" />
            <figcaption>Juegos y aventuras</figcaption>
          </figure>
          <figure className="party-moment party-moment-banner">
            <img src="/resources/Bluey/diego-outdoor.jpeg" alt="Diego Sae sonriendo al aire libre" />
            <figcaption>El protagonista de la aventura</figcaption>
          </figure>
          <figure className="party-moment party-moment-small">
            <img src="/resources/Bluey/images-transparent.png" alt="Bluey y Bingo saludando" />
            <figcaption>¡Wackadoo!</figcaption>
          </figure>
        </div>
      </section>

      <section className="party-details" id="detalles">
        <div className="party-section-heading"><p className="party-kicker">Guarda la fecha</p><h2>Todo listo para jugar</h2></div>
        <div className="party-detail-grid">
          <article className="party-detail-card party-yellow"><CalendarDays size={30} aria-hidden="true" /><p className="party-label">Cuándo</p><h3>{diegoParty.date}</h3><p>Nos vemos a las {diegoParty.time}</p></article>
          <article className="party-detail-card party-blue"><MapPin size={30} aria-hidden="true" /><p className="party-label">Dónde</p><h3>{diegoParty.venue}</h3><p>{diegoParty.address}</p><a href={diegoParty.mapUrl} target="_blank" rel="noreferrer" className="party-text-link">Ver ubicación <span>↗</span></a></article>
          <article className="party-detail-card party-coral"><PartyPopper size={30} aria-hidden="true" /><p className="party-label">El plan</p><h3>{diegoParty.food}</h3><p>{diegoParty.show}</p></article>
        </div>
        <div className="party-map" aria-label="Mapa de SMILELAB">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3593.9086095630996!2d-100.41023212298236!3d25.740535677365127!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8662973d16d958a3%3A0x5e3cd97e7f4ef423!2sSMILELAB!5e0!3m2!1sen!2smx!4v1789884134743!5m2!1sen!2smx"
            title="Mapa de SMILELAB"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </section>

      <section className="party-quote"><Star size={25} fill="currentColor" aria-hidden="true" /><p>“En esta casa hacemos cosas divertidas”</p><small>— La familia de Diego</small></section>

      <footer className="party-footer"><div className="party-footer-mark">DS</div><h2>¡Nos vemos en la fiesta!</h2><p>Diego Sae · {diegoParty.theme}</p><Clock3 size={18} aria-hidden="true" /></footer>
    </main>
  );
}
