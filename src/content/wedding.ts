export const wedding = {
  music: {
    youtubeVideoId: "ZRztvfiu-RM",
  },
  couple: {
    first: "Alei",
    second: "Scarlett",
    initials: "A · S",
  },
  date: {
    iso: "2026-11-21T18:00:00-06:00",
    receptionIso: "2026-11-21T19:00:00-06:00",
    display: "21 de noviembre de 2026",
    short: "21 · 11 · 26",
    rsvpDeadline: "21 de octubre de 2026",
  },
  location: "Santiago, Nuevo León",
  venue: {
    name: "Península Eventos",
    address: "Neptuno 316, Las Cristalinas, 67317 Santiago, N.L.",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Pen%C3%ADnsula+Eventos+Neptuno+316+Las+Cristalinas+Santiago+Nuevo+Le%C3%B3n",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d230274.63504361061!2d-100.45447340106662!3d25.603548076620804!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8662cfb26d5ce1af%3A0xb6289524b92d6b58!2sPen%C3%ADnsula%20Eventos!5e0!3m2!1sen!2smx!4v1788140779604!5m2!1sen!2smx",
  },
  hero: {
    eyebrow: "Nos casamos",
    title: "Una vida juntos comienza aquí",
    note: "Con mucha alegría queremos compartir este día contigo.",
  },
  story: {
    title: "Nuestra historia",
    body: [
      "Fue un 30 de mayo cuando cruzamos miradas por primera vez y hoy, después de 13 años, dos hijos, un hogar y una vida compartida, elegimos dar el siguiente paso: seguir eligiéndonos para siempre",
    ],
  },
  events: [
    {
      type: "Ceremonia",
      civilOnly: true,
      time: "6:00 p. m.",
      venue: "Península Eventos",
      address: "Neptuno 316, Las Cristalinas, 67317 Santiago, N.L.",
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=Pen%C3%ADnsula+Eventos+Neptuno+316+Las+Cristalinas+Santiago+Nuevo+Le%C3%B3n",
    },
    {
      type: "Recepción",
      civilOnly: false,
      time: "7:00 p. m.",
      venue: "Península Eventos",
      address: "Neptuno 316, Las Cristalinas, 67317 Santiago, N.L.",
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=Pen%C3%ADnsula+Eventos+Neptuno+316+Las+Cristalinas+Santiago+Nuevo+Le%C3%B3n",
    },
  ],
  schedule: [
    { time: "6:00 p. m.", label: "Ceremonia civil", civilOnly: true },
    { time: "7:00 p. m.", label: "Recepción", civilOnly: false },
    { time: "7:30 p. m.", label: "Cena", civilOnly: false },
    { time: "8:30 p. m.", label: "Se abre la pista", civilOnly: false },
    { time: "9:00 p. m.", label: "Happening", civilOnly: false },
  ],
  attire: {
    title: "Código de vestimenta",
    style: "Formal",
    women: "Vestido largo o midi.",
    men: "Traje.",
    note: "La celebración será en jardín. Los invitamos a vestir tonos coloridos y vibrantes, manteniendo el código formal.",
    celebration: "¡Queremos ver el jardín lleno de color!",
    reserved: "Reservamos los tonos blancos y claros para la novia.",
  },
  gifts: {
    title: "Mesa de regalos",
    note: "Tu presencia es nuestro mejor regalo. Si deseas tener un detalle con nosotros, preparamos esta mesa de regalos.",
    links: [
      { label: "Amazon", url: "https://www.amazon.com.mx/wedding/share/AleiyScarlett0706" },
    ],
  },
  faq: [
    {
      question: "¿Puedo llevar acompañante?",
      answer: "Tu invitación muestra los pases reservados para tu grupo. Por organización, solo podremos recibir a las personas que aparecen en ella.",
    },
    {
      question: "¿Será una boda para adultos?",
      answer: "Sí. Queremos que todos disfruten la noche con tranquilidad, por lo que la celebración será únicamente para adultos.",
    },
    {
      question: "¿Cuándo debo confirmar?",
      answer: "Por favor confirma tu asistencia a más tardar el 21 de octubre de 2026.",
    },
  ],
  contact: {
    label: "¿Tienes alguna duda?",
    whatsappUrl: "https://wa.me/528128243031",
  },
} as const;

export type WeddingContent = typeof wedding;
