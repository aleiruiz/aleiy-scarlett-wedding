import "server-only";
import { gunzipSync } from "node:zlib";
import { createHash } from "node:crypto";

import { google, sheets_v4 } from "googleapis";
import type {
  Invitation,
  RsvpSubmission,
} from "@/types/invitation";
import { rsvpSchema, validateSubmissionForInvitation } from "./rsvp-validation";
import { AppError } from "./app-error";

const SHEET_RANGE = "Sheet1!A3:Q";
const DEMO_TOKEN = "demo-alei-scarlett-2026";
const tokenWrites = new Map<string, Promise<void>>();

async function serializeTokenWrite<T>(token: string, operation: () => Promise<T>) {
  const previous = tokenWrites.get(token) ?? Promise.resolve();
  let release!: () => void;
  const current = new Promise<void>((resolve) => {
    release = resolve;
  });
  tokenWrites.set(token, current);

  await previous;
  try {
    return await operation();
  } finally {
    release();
    if (tokenWrites.get(token) === current) tokenWrites.delete(token);
  }
}

const demoInvitation: Invitation = {
  token: DEMO_TOKEN,
  groupName: "Familia Hernández",
  greeting: "Con mucho cariño, reservamos estos lugares para ustedes",
  guests: [
    { id: "maria-hernandez", name: "María Hernández" },
    { id: "carlos-hernandez", name: "Carlos Hernández" },
  ],
  maxPasses: 2,
  active: true,
  civil: true,
};

function hasSheetsConfiguration() {
  return Boolean(
    process.env.GOOGLE_SHEETS_ID &&
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY,
  );
}

function getSheetsClient(): sheets_v4.Sheets {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

export async function getInvitation(
  token: string,
): Promise<Invitation | null> {
  if (!hasSheetsConfiguration()) {
    if (token === DEMO_TOKEN) return demoInvitation;
    const stored = process.env.INVITATIONS_JSON?.trim() || "[]";
    const json = stored.startsWith("gzip:")
      ? gunzipSync(Buffer.from(stored.slice(5), "base64")).toString("utf8")
      : stored;
    const invitations = JSON.parse(json) as Invitation[];
    return invitations.find((item) => item.token === token && item.active) ?? null;
  }

  const sheets = getSheetsClient();
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range: SHEET_RANGE,
  });
  const row = (result.data.values ?? []).find((item) => item[12] === token);

  if (!row) return null;

  return invitationFromRow(token, row);
}

function invitationFromRow(token: string, row: unknown[]): Invitation {
  const names = String(row[14] ?? "")
    .split(/\s+-\s+|\r?\n/)
    .map((name) => name.trim())
    .filter(Boolean);
  if (new Set(names).size !== names.length || names.length > 20) {
    throw new Error("Usa hasta 20 nombres distintos en la columna O.");
  }
  const maxPasses = Number(row[1]) || 1;
  const guestNames = names.length
    ? names
    : Array.from({ length: maxPasses }, (_, index) => `Invitado ${index + 1}`);
  const invitation: Invitation = {
    token,
    groupName: String(row[0] ?? "Invitados"),
    greeting: "Con mucho cariño, reservamos estos lugares para ustedes.",
    guests: guestNames.map((name) => ({
      id: createHash("sha256").update(`${token}:${name}`).digest("hex"),
      name,
    })),
    maxPasses,
    active: true,
    civil: String(row[11] ?? "").trim().toUpperCase() === "CIVIL",
  };

  if (row[15]) {
    const saved = rsvpSchema.parse(JSON.parse(String(row[15])));
    if (saved.token !== token) throw new Error("La respuesta guardada no corresponde a esta invitación.");
    invitation.response = {
      guests: saved.guests.filter((response) => invitation.guests.some((guest) => guest.id === response.guestId)),
      phone: saved.phone,
      message: saved.message,
    };
  }
  return invitation;
}

export async function saveRsvp(submission: RsvpSubmission) {
  return serializeTokenWrite(submission.token, () => saveRsvpUnsafe(submission));
}

async function saveRsvpUnsafe(submission: RsvpSubmission) {
  const invitation = await getInvitation(submission.token);
  if (!invitation) {
    throw new AppError(
      "No encontramos una invitación vigente para este enlace.",
      404,
    );
  }
  validateSubmissionForInvitation(submission, invitation);

  if (!hasSheetsConfiguration()) {
    if (submission.token !== DEMO_TOKEN) {
      throw new AppError("Las confirmaciones aún no están habilitadas. Inténtalo más tarde.", 503);
    }
    return { updated: false, demo: true };
  }

  const sheets = getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  const responseRows = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: SHEET_RANGE,
  });
  const rows = responseRows.data.values ?? [];
  const existingIndex = rows.findIndex((row) => row[12] === submission.token);
  if (existingIndex < 0) throw new AppError("La invitación ya no está disponible.", 404);
  const latest = invitationFromRow(submission.token, rows[existingIndex]);
  validateSubmissionForInvitation(submission, latest);
  const rowNumber = existingIndex + 3;
  const attending = submission.guests.filter((guest) => guest.attending).length;
  const summary = submission.guests.map((response) => {
    const guest = latest.guests.find((item) => item.id === response.guestId)!;
    return `${guest.name}: ${response.attending ? "Confirmado" : "No asistirá"}`;
  }).join("\n");
  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId,
    requestBody: {
      valueInputOption: "RAW",
      data: [
        { range: `Sheet1!F${rowNumber}`, values: [[submission.phone]] },
        { range: `Sheet1!J${rowNumber}:K${rowNumber}`, values: [[attending === 0 ? "No" : attending === submission.guests.length ? "Sí" : "Parcial", attending]] },
        { range: `Sheet1!P${rowNumber}:Q${rowNumber}`, values: [[JSON.stringify(submission), summary]] },
      ],
    },
  });

  return { updated: true, demo: false };
}
