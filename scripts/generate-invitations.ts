import { randomBytes } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

type InputGroup = {
  groupName: string;
  greeting?: string;
  guests: string[];
  maxPasses?: number;
  active?: boolean;
  expiresAt?: string;
  civil?: boolean;
};

function csv(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

async function main() {
  const inputPath = resolve(process.argv[2] ?? "data/invitations.json");
  const outputPath = resolve(
    process.argv[3] ?? "data/invitations.generated.csv",
  );
  const baseUrl = (
    process.env.INVITATION_BASE_URL ?? "http://localhost:3000"
  ).replace(/\/$/, "");
  const groups = JSON.parse(await readFile(inputPath, "utf8")) as InputGroup[];

  const header = ["Familia", "Pases", "", "", "", "WhatsApp", "", "", "",
    "Confirmación", "Asistentes", "Civil", "Token", "Enlace", "Nombres", "Respuesta JSON", "Detalle"].map(csv);

  const rows = groups.map((group) => {
    if (!group.groupName || group.guests.length === 0) {
      throw new Error("Cada grupo necesita un nombre y al menos un invitado.");
    }

    const guests = group.guests.map((name) => name.trim());
    if (guests.some((name) => !name || /[\r\n]/.test(name)) ||
        new Set(guests).size !== guests.length || guests.length > 20) {
      throw new Error("Cada grupo necesita hasta 20 nombres distintos, sin saltos de línea.");
    }
    const maxPasses = group.maxPasses ?? guests.length;
    if (!Number.isInteger(maxPasses) || maxPasses < 1) {
      throw new Error("El número de pases debe ser un entero positivo.");
    }
    if (group.active === false || group.expiresAt) {
      throw new Error("El formato Sheet1 no admite active ni expiresAt; elimina la fila para desactivar una invitación.");
    }
    const token = randomBytes(24).toString("base64url");
    const link = `${baseUrl}/invitacion/${token}`;
    return [
      group.groupName,
      maxPasses,
      "", "", "", "", "", "", "", "", "",
      group.civil ? "CIVIL" : "", token, link,
      guests.join("\n"), "", "",
    ].map(csv);
  });

  await writeFile(
    outputPath,
    [header, ...rows].map((row) => row.join(",")).join("\n"),
    "utf8",
  );
  console.log(`Se generaron ${rows.length} invitaciones en ${outputPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
