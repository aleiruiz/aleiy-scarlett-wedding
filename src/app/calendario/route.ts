import { wedding } from "../../content/wedding";
import { forInvitation } from "../../lib/invitation-audience";

const escapeText = (value: string) => value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
const utc = (value: string) => new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

// Fold by UTF-8 bytes so accented Spanish text remains valid iCalendar.
function fold(line: string) {
  const parts: string[] = [];
  let part = "";
  for (const character of line) {
    if (Buffer.byteLength(part + character, "utf8") > 75) {
      parts.push(part);
      part = " ";
    }
    part += character;
  }
  return [...parts, part].join("\r\n");
}

export function GET(request: Request) {
  const civil = new URL(request.url).searchParams.get("civil") === "1";
  const description = forInvitation(wedding.schedule, civil).map(item => `${item.time} — ${item.label}`).join("\n");
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Alei y Scarlett//Invitacion//ES", "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT", `UID:boda-20261121-${civil ? "civil" : "recepcion"}@aleiyscarlett.local`,
    `DTSTAMP:${utc(new Date().toISOString())}`, `DTSTART:${utc(civil ? wedding.date.iso : wedding.date.receptionIso)}`,
    `SUMMARY:${escapeText("Boda de Alei y Scarlett")}`, `LOCATION:${escapeText(`${wedding.venue.name}, ${wedding.venue.address}`)}`,
    `DESCRIPTION:${escapeText(description)}`, "END:VEVENT", "END:VCALENDAR"];
  return new Response(lines.map(fold).join("\r\n") + "\r\n", { headers: {
    "Content-Type": "text/calendar; charset=utf-8",
    "Content-Disposition": 'attachment; filename="boda-alei-y-scarlett.ics"',
  } });
}
