import "server-only";

import { google, sheets_v4 } from "googleapis";
import type {
  Guest,
  GuestResponse,
  Invitation,
  RsvpSubmission,
} from "@/types/invitation";
import { validateSubmissionForInvitation } from "@/lib/rsvp-validation";
import { AppError } from "@/lib/app-error";

const INVITATIONS_RANGE = "Invitaciones!A2:G";
const RESPONSES_RANGE = "Confirmaciones!A2:I";
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

async function getExistingResponse(
  sheets: sheets_v4.Sheets,
  token: string,
): Promise<Invitation["response"] | undefined> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: RESPONSES_RANGE,
  });
  const rows = result.data.values ?? [];
  const matching = rows.filter((row) => row[0] === token);

  if (matching.length === 0) return undefined;

  return {
    guests: matching.map(
      (row): GuestResponse => ({
        guestId: String(row[1]),
        attending: String(row[3]).toLowerCase() === "sí",
        dietary: String(row[4] ?? ""),
      }),
    ),
    phone: String(matching[0][5] ?? ""),
    message: String(matching[0][6] ?? ""),
  };
}

export async function getInvitation(
  token: string,
): Promise<Invitation | null> {
  if (!hasSheetsConfiguration()) {
    return token === DEMO_TOKEN ? demoInvitation : null;
  }

  const sheets = getSheetsClient();
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range: INVITATIONS_RANGE,
  });
  const row = (result.data.values ?? []).find((item) => item[0] === token);

  if (!row) return null;

  const invitation: Invitation = {
    token: String(row[0]),
    groupName: String(row[1]),
    greeting: String(row[2]),
    guests: parseGuests(String(row[3])),
    maxPasses: Number(row[4]),
    active: String(row[5]).toLowerCase() !== "no",
    expiresAt: row[6] ? String(row[6]) : undefined,
  };

  const isExpired =
    invitation.expiresAt &&
    new Date(invitation.expiresAt).getTime() < Date.now();
  if (!invitation.active || isExpired) return null;

  invitation.response = await getExistingResponse(sheets, token);
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
    return { updated: false, demo: true };
  }

  const sheets = getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  const responseRows = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: RESPONSES_RANGE,
  });
  const rows = responseRows.data.values ?? [];
  const now = new Date().toISOString();

  const updates: sheets_v4.Schema$ValueRange[] = [];
  const additions: unknown[][] = [];

  for (const guestResponse of submission.guests) {
    const guest = invitation.guests.find(
      (item) => item.id === guestResponse.guestId,
    );
    if (!guest) continue;

    const values = [
      submission.token,
      guest.id,
      guest.name,
      guestResponse.attending ? "Sí" : "No",
      guestResponse.dietary ?? "",
      submission.phone,
      submission.message ?? "",
      now,
      invitation.groupName,
    ];
    const existingIndex = rows.findIndex(
      (row) => row[0] === submission.token && row[1] === guest.id,
    );

    if (existingIndex >= 0) {
      updates.push({
        range: `Confirmaciones!A${existingIndex + 2}:I${existingIndex + 2}`,
        values: [values],
      });
    } else {
      additions.push(values);
    }
  }

  if (updates.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: { valueInputOption: "RAW", data: updates },
    });
  }

  if (additions.length > 0) {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: RESPONSES_RANGE,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: additions },
    });
  }

  return { updated: true, demo: false };
}
