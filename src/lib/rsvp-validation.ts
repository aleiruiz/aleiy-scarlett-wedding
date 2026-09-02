import { z } from "zod";
import type { Invitation, RsvpSubmission } from "@/types/invitation";
import { AppError } from "./app-error";

export const rsvpSchema = z.object({
  token: z.string().min(16).max(200),
  guests: z
    .array(
      z.object({
        guestId: z.string().min(1).max(100),
        attending: z.boolean(),
        dietary: z.string().trim().max(300).optional(),
      }),
    )
    .min(1)
    .max(20),
  phone: z.string().trim().min(8).max(25),
  message: z.string().trim().max(600).optional(),
});

export function validateSubmissionForInvitation(
  submission: RsvpSubmission,
  invitation: Invitation,
) {
  const allowedIds = new Set(invitation.guests.map((guest) => guest.id));
  const submittedIds = submission.guests.map((guest) => guest.guestId);
  const uniqueIds = new Set(submittedIds);

  if (
    submittedIds.length !== invitation.guests.length ||
    uniqueIds.size !== submittedIds.length ||
    submittedIds.some((id) => !allowedIds.has(id))
  ) {
    throw new AppError(
      "La confirmación no coincide con las personas invitadas.",
      400,
    );
  }

  const attending = submission.guests.filter((guest) => guest.attending).length;
  if (attending > invitation.maxPasses) {
    throw new AppError(
      "La confirmación supera el número de pases disponibles.",
      400,
    );
  }
}
