"use client";

import { FormEvent, useMemo, useState } from "react";
import { Check, LoaderCircle, Send, X } from "lucide-react";
import type { Invitation } from "@/types/invitation";

type AttendanceState = Record<string, boolean | null>;
type DietaryState = Record<string, string>;

export function RsvpForm({ invitation }: { invitation: Invitation }) {
  const previous = invitation.response;
  const initialAttendance = useMemo(
    () =>
      Object.fromEntries(
        invitation.guests.map((guest) => [
          guest.id,
          previous?.guests.find((item) => item.guestId === guest.id)
            ?.attending ?? null,
        ]),
      ) as AttendanceState,
    [invitation.guests, previous],
  );
  const initialDietary = useMemo(
    () =>
      Object.fromEntries(
        invitation.guests.map((guest) => [
          guest.id,
          previous?.guests.find((item) => item.guestId === guest.id)
            ?.dietary ?? "",
        ]),
      ) as DietaryState,
    [invitation.guests, previous],
  );

  const [attendance, setAttendance] =
    useState<AttendanceState>(initialAttendance);
  const [dietary, setDietary] = useState<DietaryState>(initialDietary);
  const [phone, setPhone] = useState(previous?.phone ?? "");
  const [message, setMessage] = useState(previous?.message ?? "");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [feedback, setFeedback] = useState("");
  const [savedResponse, setSavedResponse] = useState(previous);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const missing = invitation.guests.some(
      (guest) => attendance[guest.id] === null,
    );
    if (missing) {
      setStatus("error");
      setFeedback("Indica si asistirá cada persona de la invitación.");
      return;
    }

    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: invitation.token,
          guests: invitation.guests.map((guest) => ({
            guestId: guest.id,
            attending: attendance[guest.id],
            dietary: dietary[guest.id],
          })),
          phone,
          message,
        }),
      });
      const result = (await response.json()) as {
        error?: string;
        message?: string;
        demo?: boolean;
      };
      if (!response.ok) throw new Error(result.error);

      if (!result.demo) {
        setSavedResponse({
          guests: invitation.guests.map((guest) => ({
            guestId: guest.id,
            attending: attendance[guest.id] === true,
            dietary: dietary[guest.id],
          })),
          phone,
          message,
        });
      }

      setStatus("success");
      setFeedback(result.message ?? "¡Gracias por confirmar!");
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof Error && error.message
          ? error.message
          : "No pudimos guardar tu respuesta. Inténtalo de nuevo.",
      );
    }
  }

  return (
    <form className="rsvp-form" onSubmit={handleSubmit}>
      <div className="rsvp-intro">
        <p className="eyebrow">Reservamos {invitation.maxPasses} pases</p>
        <h3>{invitation.groupName}</h3>
        <p>{invitation.greeting}</p>
      </div>

      <div className="guest-list">
        {invitation.guests.map((guest) => (
          <fieldset className="guest-card" key={guest.id}>
            <legend>{guest.name}</legend>
            <p role="status">
              Estado guardado: {savedResponse?.guests.find((item) => item.guestId === guest.id)?.attending === true
                ? "Asistencia confirmada"
                : savedResponse?.guests.find((item) => item.guestId === guest.id)?.attending === false
                  ? "No asistirá"
                  : "Pendiente de respuesta"}
            </p>
            <div className="attendance-buttons">
              <button
                type="button"
                className={attendance[guest.id] === true ? "selected" : ""}
                aria-pressed={attendance[guest.id] === true}
                onClick={() =>
                  setAttendance((current) => ({
                    ...current,
                    [guest.id]: true,
                  }))
                }
              >
                <Check size={17} aria-hidden="true" />
                Sí asistiré
              </button>
              <button
                type="button"
                className={attendance[guest.id] === false ? "selected" : ""}
                aria-pressed={attendance[guest.id] === false}
                onClick={() =>
                  setAttendance((current) => ({
                    ...current,
                    [guest.id]: false,
                  }))
                }
              >
                <X size={17} aria-hidden="true" />
                No podré
              </button>
            </div>
            {attendance[guest.id] === true && (
              <label className="field">
                <span>Alergias o restricciones alimentarias</span>
                <input
                  value={dietary[guest.id]}
                  onChange={(event) =>
                    setDietary((current) => ({
                      ...current,
                      [guest.id]: event.target.value,
                    }))
                  }
                  maxLength={300}
                  placeholder="Ninguna"
                />
              </label>
            )}
          </fieldset>
        ))}
      </div>

      <label className="field">
        <span>WhatsApp de contacto</span>
        <input
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          autoComplete="tel"
          placeholder="Ej. 55 1234 5678"
          minLength={8}
          maxLength={25}
          required
        />
      </label>

      <label className="field">
        <span>Déjanos un mensaje (opcional)</span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={3}
          maxLength={600}
          placeholder="Nos encantará leerte…"
        />
      </label>

      <button
        className="button button-primary submit-button"
        type="submit"
        disabled={status === "loading"}
      >
        {status === "loading" ? (
          <LoaderCircle className="spin" size={18} aria-hidden="true" />
        ) : (
          <Send size={18} aria-hidden="true" />
        )}
        {savedResponse ? "Actualizar confirmación" : "Enviar confirmación"}
      </button>

      {feedback && (
        <p
          className={`form-feedback ${status}`}
          role={status === "error" ? "alert" : "status"}
        >
          {feedback}
        </p>
      )}
    </form>
  );
}
