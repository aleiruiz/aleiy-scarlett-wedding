import { describe, expect, it } from "vitest";
import type { Invitation, RsvpSubmission } from "@/types/invitation";
import {
  rsvpSchema,
  validateSubmissionForInvitation,
} from "./rsvp-validation";

const invitation: Invitation = {
  token: "token-seguro-de-prueba",
  groupName: "Familia Prueba",
  greeting: "Bienvenidos",
  guests: [
    { id: "ana", name: "Ana" },
    { id: "luis", name: "Luis" },
  ],
  maxPasses: 2,
  active: true,
};

const validSubmission: RsvpSubmission = {
  token: invitation.token,
  guests: [
    { guestId: "ana", attending: true },
    { guestId: "luis", attending: false },
  ],
  phone: "5512345678",
};

describe("rsvpSchema", () => {
  it("acepta una confirmación completa", () => {
    expect(rsvpSchema.parse(validSubmission)).toMatchObject(validSubmission);
  });

  it("rechaza tokens cortos y teléfonos inválidos", () => {
    expect(() =>
      rsvpSchema.parse({ ...validSubmission, token: "corto", phone: "123" }),
    ).toThrow();
  });
});

describe("validateSubmissionForInvitation", () => {
  it("acepta exactamente los invitados asignados", () => {
    expect(() =>
      validateSubmissionForInvitation(validSubmission, invitation),
    ).not.toThrow();
  });

  it("rechaza invitados ajenos o faltantes", () => {
    expect(() =>
      validateSubmissionForInvitation(
        {
          ...validSubmission,
          guests: [{ guestId: "persona-ajena", attending: true }],
        },
        invitation,
      ),
    ).toThrow(/no coincide/);
  });

  it("rechaza más asistentes que pases disponibles", () => {
    expect(() =>
      validateSubmissionForInvitation(
        {
          ...validSubmission,
          guests: validSubmission.guests.map((guest) => ({
            ...guest,
            attending: true,
          })),
        },
        { ...invitation, maxPasses: 1 },
      ),
    ).toThrow(/supera/);
  });
});
