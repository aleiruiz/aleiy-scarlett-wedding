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
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

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

  const header = [
    "token",
    "groupName",
    "greeting",
    "guestsJson",
    "maxPasses",
    "active",
    "expiresAt",
    "link",
    "mensajeWhatsApp",
  ].map(csv);

  const rows = groups.map((group) => {
    if (!group.groupName || group.guests.length === 0) {
      throw new Error("Cada grupo necesita un nombre y al menos un invitado.");
    }

    const usedIds = new Set<string>();
    const guests = group.guests.map((name, index) => {
      const baseId = slugify(name) || `invitado-${index + 1}`;
      const id = usedIds.has(baseId) ? `${baseId}-${index + 1}` : baseId;
      usedIds.add(id);
      return { id, name };
    });
    const token = randomBytes(24).toString("base64url");
    const link = `${baseUrl}/invitacion/${token}`;
    const message = `¡Hola, ${group.groupName}! Tenemos una invitación especial para ustedes: ${link}`;

    return [
      token,
      group.groupName,
      group.greeting ??
        "Con mucho cariño, reservamos estos lugares para ustedes",
      JSON.stringify(guests),
      group.maxPasses ?? guests.length,
      group.active === false ? "No" : "Sí",
      group.expiresAt ?? "",
      link,
      message,
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
