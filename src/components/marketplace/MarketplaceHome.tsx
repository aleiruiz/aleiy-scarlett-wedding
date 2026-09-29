"use client";

import Link from "next/link";
import { ArrowRight, Heart, Search, Sparkles, Star } from "lucide-react";
import { useMemo, useState } from "react";

type Category = "Todos" | "Bodas" | "Infantiles" | "Bautizos" | "Comuniones" | "Confirmaciones" | "XV años" | "Cumpleaños" | "Juveniles" | "Adultos";

const templates = [
  {
    title: "Botánica editorial",
    category: "Bodas" as Category,
    tag: "Más vendida",
    description: "Una invitación serena y elegante para celebrar una historia que acaba de empezar.",
    price: "$499 MXN",
    colors: ["#f1eadc", "#87977f", "#b38269"],
    image: "/photos/entry.webp",
    demo: "/invitacion/demo-alei-scarlett-2026",
  },
  {
    title: "Un día inolvidable",
    category: "Cumpleaños" as Category,
    tag: "Nueva",
    description: "Colores suaves, detalles cálidos y espacio para contar lo que hace especial tu día.",
    price: "$349 MXN",
    colors: ["#f9d9c8", "#ef9c7b", "#536b73"],
    image: "/photos/family.webp",
    demo: "/invitacion/demo-alei-scarlett-2026",
  },
  {
    title: "Aventura en colores",
    category: "Infantiles" as Category,
    tag: "Favorita",
    description: "Una experiencia juguetona para anunciar una fiesta llena de amigos y grandes aventuras.",
    price: "$299 MXN",
    colors: ["#1676a9", "#ffd34e", "#f07b68"],
    image: "/resources/Bluey/20251024_074705.jpg",
    demo: "/fiesta/diego-sae",
  },
  {
    title: "Luz de vida",
    category: "Bautizos" as Category,
    tag: "Serena",
    description: "Una bienvenida dulce y luminosa para compartir la llegada de un nuevo comienzo.",
    price: "$349 MXN",
    colors: ["#e8e0d3", "#b7c5bb", "#d1a98d"],
    image: "/photos/entry.webp",
    demo: "/invitacion/demo-alei-scarlett-2026",
  },
  {
    title: "Primer sacramento",
    category: "Comuniones" as Category,
    tag: "Clásica",
    description: "Un diseño delicado y atemporal para guardar la memoria de un día muy especial.",
    price: "$349 MXN",
    colors: ["#f8f4ec", "#c5b795", "#7b8971"],
    image: "/photos/family.webp",
    demo: "/invitacion/demo-alei-scarlett-2026",
  },
  {
    title: "Un nuevo camino",
    category: "Confirmaciones" as Category,
    tag: "Elegante",
    description: "Una invitación sobria, cercana y especial para celebrar una decisión importante.",
    price: "$349 MXN",
    colors: ["#e7e0d4", "#596b62", "#c6a875"],
    image: "/photos/entry.webp",
    demo: "/invitacion/demo-alei-scarlett-2026",
  },
  {
    title: "La noche de Valentina",
    category: "XV años" as Category,
    tag: "Protagonista",
    description: "Brillos sutiles y una presencia inolvidable para celebrar el inicio de una nueva etapa.",
    price: "$499 MXN",
    colors: ["#d8c7d8", "#b37479", "#efe1ce"],
    image: "/photos/family.webp",
    demo: "/invitacion/demo-alei-scarlett-2026",
  },
  {
    title: "After party",
    category: "Juveniles" as Category,
    tag: "En tendencia",
    description: "Una propuesta fresca y con personalidad para cumpleaños, graduaciones y reuniones.",
    price: "$299 MXN",
    colors: ["#232d42", "#e78083", "#f4cc61"],
    image: "/resources/Bluey/20251101_211608.jpg",
    demo: "/fiesta/diego-sae",
  },
  {
    title: "Una buena cosecha",
    category: "Adultos" as Category,
    tag: "Sobria",
    description: "Una invitación madura y refinada para aniversarios, cenas y celebraciones íntimas.",
    price: "$399 MXN",
    colors: ["#263a2b", "#b89a67", "#f6f1e8"],
    image: "/photos/entry.webp",
    demo: "/invitacion/demo-alei-scarlett-2026",
  },
];

export function MarketplaceHome() {
  const [category, setCategory] = useState<Category>("Todos");
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => templates.filter((template) =>
      (category === "Todos" || template.category === category) &&
      template.title.toLowerCase().includes(query.toLowerCase()),
    ),
    [category, query],
  );

  return (
    <main className="marketplace-page">
      <nav className="marketplace-nav">
        <Link className="brand-mark" href="/" aria-label="Lumbre, inicio"><span>lu</span>mbre</Link>
        <div className="marketplace-nav-links"><a href="#plantillas">Plantillas</a><a href="#como-funciona">Cómo funciona</a><a href="#faq">Preguntas frecuentes</a></div>
        <Link className="nav-cta" href="#plantillas">Ver plantillas <ArrowRight size={15} /></Link>
      </nav>

      <section className="marketplace-hero">
        <div className="hero-copy">
          <p className="marketplace-eyebrow"><Sparkles size={14} /> Invitaciones digitales con intención</p>
          <h1>Tu momento merece<br /><em>una gran entrada.</em></h1>
          <p className="hero-description">Plantillas bonitas, fáciles de personalizar y listas para compartir. Diseñadas para que tu celebración empiece desde el primer clic.</p>
          <div className="hero-actions"><Link className="marketplace-button dark" href="#plantillas">Explorar plantillas <ArrowRight size={17} /></Link><Link className="text-link" href="#como-funciona">Así funciona <span>↓</span></Link></div>
          <div className="hero-proof"><div className="avatar-stack"><i /><i /><i /></div><span><strong>+500 celebraciones</strong><br />ya tienen su invitación</span></div>
        </div>
        <div className="hero-art" aria-label="Vista previa de una invitación botánica">
          <div className="hero-card-back" /><div className="hero-card"><span className="card-tiny">SAVE THE DATE</span><div className="card-flower">✽</div><p>Una historia<br /><i>para siempre</i></p><small>alei & scarlett</small><div className="card-line" /><span className="card-date">12 · 09 · 26</span></div><div className="hero-sticker">hecho<br /><b>para ti</b> <Heart size={13} fill="currentColor" /></div>
        </div>
      </section>

      <section className="trust-row"><span>Hechas para momentos que importan</span><div><span>✦ Sin límites de invitados</span><span>✦ Confirmación de asistencia</span><span>✦ Comparte por WhatsApp</span></div></section>

      <section id="plantillas" className="template-section">
        <div className="section-heading"><div><p className="marketplace-eyebrow">Elige tu favorita</p><h2>Diseñadas para<br /><em>decirlo todo.</em></h2></div><div className="template-tools"><label className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar diseño" aria-label="Buscar diseño" /></label><div className="category-tabs">{(["Todos", "Bodas", "Infantiles", "Bautizos", "Comuniones", "Confirmaciones", "XV años", "Cumpleaños", "Juveniles", "Adultos"] as Category[]).map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div></div></div>
        <div className="template-grid">{filtered.map((template) => <article className="template-card" key={template.title}><div className="template-image"><img src={template.image} alt="" /><span className="template-tag">{template.tag}</span><button aria-label={`Guardar ${template.title}`} className="save-template"><Heart size={16} /></button><div className="template-preview"><Link href={template.demo}>Ver demo <ArrowRight size={14} /></Link></div></div><div className="template-info"><div><p className="template-category">{template.category}</p><h3>{template.title}</h3><p>{template.description}</p></div><div className="template-bottom"><span className="template-price">{template.price}</span><div className="swatches">{template.colors.map((color) => <i key={color} style={{ backgroundColor: color }} />)}</div><Link href="#comprar" className="round-arrow" aria-label={`Comprar ${template.title}`}><ArrowRight size={17} /></Link></div></div></article>)}</div>
      </section>

      <section id="como-funciona" className="how-section"><div className="how-intro"><p className="marketplace-eyebrow">Sin complicaciones</p><h2>De tu idea<br />a tu <em>invitación.</em></h2><p>Todo lo que necesitas para anunciar tu día de una forma tan especial como el momento.</p></div><div className="steps"><div><span>01</span><h3>Elige un diseño</h3><p>Explora la colección y encuentra el estilo que se sienta más tú.</p></div><div><span>02</span><h3>Cuéntanos tu historia</h3><p>Personalizamos textos, colores, fotos y todos los detalles de tu evento.</p></div><div><span>03</span><h3>Compártela con todos</h3><p>Recibe tu enlace listo para enviar y empieza a recibir confirmaciones.</p></div></div></section>

      <section id="comprar" className="marketplace-bottom"><div><Star size={17} fill="currentColor" /><p>Una buena invitación<br /><em>abre la celebración.</em></p></div><Link className="marketplace-button light" href="#plantillas">Encontrar mi plantilla <ArrowRight size={17} /></Link></section>
      <footer id="faq" className="marketplace-footer"><Link className="brand-mark" href="/" aria-label="Lumbre, inicio"><span>lu</span>mbre</Link><p>Invitaciones digitales para días inolvidables.</p><small>© 2026 Lumbre Studio · Hecho con cariño en México</small></footer>
    </main>
  );
}
