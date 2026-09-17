import "server-only";
import { gunzipSync } from "node:zlib";

import { google, sheets_v4 } from "googleapis";
import type {
  Guest,
  GuestResponse,
  Invitation,
  RsvpSubmission,
} from "@/types/invitation";
import { validateSubmissionForInvitation } from "@/lib/rsvp-validation";
import { AppError } from "@/lib/app-error";

const SHEET_RANGE = "Sheet1!A3:N";
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

function parseGuests(value: string): Guest[] {
  const parsed: unknown = JSON.parse(value);
  if (
    !Array.isArray(parsed) ||
    parsed.some(
      (guest) =>
        typeof guest !== "object" ||
        guest === null ||
        typeof (guest as Guest).id !== "string" ||
        typeof (guest as Guest).name !== "string",
    )
  ) {
    throw new Error("La columna de invitados contiene JSON inválido.");
  }

  return parsed as Guest[];
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

  const invitation: Invitation = {
    token,
    groupName: String(row[0] ?? "Invitados"),
    greeting: "Con mucho cariño, reservamos estos lugares para ustedes.",
    guests: [{ id: `${token}-guest`, name: String(row[0] ?? "Invitado") }],
    maxPasses: Number(row[1]) || 1,
    active: true,
    civil: String(row[11] ?? "").trim().toUpperCase() === "CIVIL",
  };

  const isExpired =
    invitation.expiresAt &&
    new Date(invitation.expiresAt).getTime() < Date.now();
  if (!invitation.active || isExpired) return null;

  invitation.response = row[9]
    ? { guests: [{ guestId: `${token}-guest`, attending: String(row[9]).toLowerCase() === "sí", dietary: "" }], phone: String(row[5] ?? ""), message: "" }
    : undefined;
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
  const guestResponse = submission.guests[0];
  if (guestResponse) {
    const guest = invitation.guests.find(
      (item) => item.id === guestResponse.guestId,
    );
    if (!guest) return { updated: false, demo: false };

    const values = [
      guestResponse.attending ? "Sí" : "No",
      submission.guests.filter((item) => item.attending).length,
    ];
    const existingIndex = rows.findIndex((row) => row[12] === submission.token);
    if (existingIndex >= 0) await sheets.spreadsheets.values.batchUpdate({ spreadsheetId, requestBody: { valueInputOption: "RAW", data: [{ range: `Sheet1!J${existingIndex + 3}:K${existingIndex + 3}`, values: [values] }] } });
  }

  return { updated: true, demo: false };
}
