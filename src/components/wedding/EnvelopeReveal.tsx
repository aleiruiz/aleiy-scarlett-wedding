"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { wedding } from "@/content/wedding";

export function EnvelopeReveal({
  groupName,
}: {
  groupName: string;
}) {
  const [phase, setPhase] = useState<"closed" | "opening" | "opened">(
    "closed",
  );
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.classList.remove("invitation-opened");
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      document.documentElement.classList.remove("invitation-opened");
    };
  }, []);

  useEffect(() => {
    if (phase === "opened") return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [phase]);

  function openInvitation() {
    if (phase !== "closed") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("opened");
      document.documentElement.classList.add("invitation-opened");
      return;
    }
    setPhase("opening");
    timerRef.current = window.setTimeout(() => {
      setPhase("opened");
      document.documentElement.classList.add("invitation-opened");
    }, 1_550);
  }

  return (
    <div
      className={`invitation-reveal ${phase}`}
      aria-hidden={phase === "opened"}
    >
      <div className="reveal-backdrop" />
      <div className="reveal-heading">
        <p>Una invitación para</p>
        <h2>{groupName}</h2>
      </div>

      <button
        className="envelope-button"
        type="button"
        onClick={openInvitation}
        disabled={phase !== "closed"}
        aria-label="Abrir invitación"
      >
        <span className="envelope">
          <span className="envelope-back" />
          <span className="envelope-letter">
            <span className="letter-eyebrow">Nos casamos</span>
            <strong>
              {wedding.couple.first}
              <i>&</i>
              {wedding.couple.second}
            </strong>
            <span className="letter-date">{wedding.date.short}</span>
          </span>
          <span className="envelope-side-fold envelope-side-fold-left" />
          <span className="envelope-side-fold envelope-side-fold-right" />
          <span className="envelope-flap" />
          <span
            className="envelope-ornament envelope-ornament-left"
            aria-hidden="true"
          />
          <span
            className="envelope-ornament envelope-ornament-right"
            aria-hidden="true"
          />
          <span className="wax-seal">
            <span className="wax-seal-text">{wedding.couple.initials}</span>
          </span>
          <Image
            className="envelope-flowers envelope-flowers-left"
            src="/envelope-flowers-left.png"
            alt=""
            width={683}
            height={1024}
            priority
            draggable={false}
          />
          <Image
            className="envelope-flowers envelope-flowers-right"
            src="/envelope-flowers-right.png"
            alt=""
            width={820}
            height={820}
            priority
            draggable={false}
          />
        </span>
        <span className="open-prompt">
          {phase === "closed" ? "Toca para abrir" : "Abriendo invitación…"}
        </span>
      </button>
    </div>
  );
}
