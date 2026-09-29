import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { get, batchUpdate } = vi.hoisted(() => ({ get: vi.fn(), batchUpdate: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("googleapis", () => ({
  google: {
    auth: { GoogleAuth: class {} },
    sheets: () => ({ spreadsheets: { values: { get, batchUpdate } } }),
  },
}));
import { getInvitation, saveRsvp } from "./google-sheets";

const token = "token-privado-para-pruebas";
let row: string[];

beforeEach(() => {
  vi.stubEnv("GOOGLE_SHEETS_ID", "sheet-test");
  vi.stubEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL", "test@example.com");
  vi.stubEnv("GOOGLE_PRIVATE_KEY", "test");
  row = Array(17).fill("");
  row[0] = "Familia Prueba";
  row[1] = "2";
  row[13] = token;
  row[2] = "Ana - Luis";
  get.mockReset().mockImplementation(async () => ({ data: { values: [row] } }));
  batchUpdate.mockReset().mockResolvedValue({});
});
afterEach(() => vi.unstubAllEnvs());

describe("invitaciones en Google Sheets", () => {
  it("mantiene disponible la invitación demo con Google Sheets configurado", async () => {
    const invitation = await getInvitation("demo-alei-scarlett-2026");
    expect(invitation?.groupName).toBe("Familia Hernández");
    expect(get).not.toHaveBeenCalled();
  });

  it("lee nombres y conserva IDs al reordenarlos", async () => {
    const first = await getInvitation(token);
    expect(first?.guests.map((guest) => guest.name)).toEqual(["Ana", "Luis"]);
    expect(first?.response).toBeUndefined();
    row[2] = "Luis - Ana";
    expect((await getInvitation(token))?.guests).toEqual(first?.guests.toReversed());
  });

  it("guarda y recupera confirmaciones mixtas con todos sus datos", async () => {
    const invitation = (await getInvitation(token))!;
    const submission = {
      token,
      guests: invitation.guests.map((guest, index) => ({ guestId: guest.id, attending: index === 0, dietary: index === 0 ? "Sin nueces" : "" })),
      phone: "5512345678",
      message: "¡Gracias!",
    };
    await expect(saveRsvp(submission)).resolves.toEqual({ updated: true, demo: false });
    const data = batchUpdate.mock.calls[0][0].requestBody.data;
    expect(data).toContainEqual({ range: "Sheet1!K3:L3", values: [["Parcial", 1]] });
    expect(data).toContainEqual({ range: "Sheet1!G3", values: [[submission.phone]] });
    row[15] = data.find((item: { range: string }) => item.range === "Sheet1!P3:Q3").values[0][0];
    expect((await getInvitation(token))?.response).toEqual({ guests: submission.guests, phone: submission.phone, message: submission.message });
    row[2] = "Ana - Pedro";
    expect((await getInvitation(token))?.response?.guests).toEqual([submission.guests[0]]);
  });

  it("respeta el rechazo anterior y no interpreta pendientes como rechazo", async () => {
    row[2] = "";
    row[9] = "No";
    expect((await getInvitation(token))?.guests.map((guest) => guest.name)).toEqual(["Invitado 1", "Invitado 2"]);
    expect((await getInvitation(token))?.response).toBeUndefined();
    row[9] = "Pendiente";
    expect((await getInvitation(token))?.response).toBeUndefined();
  });

  it("admite saltos de línea de hojas anteriores", async () => {
    row[2] = "Ana\nLuis";
    expect((await getInvitation(token))?.guests.map((guest) => guest.name)).toEqual(["Ana", "Luis"]);
  });

  it("completa los pases sin nombre con invitados genéricos", async () => {
    row[2] = "Nancy Ortega";
    expect((await getInvitation(token))?.guests.map((guest) => guest.name)).toEqual([
      "Nancy Ortega",
      "Invitado 1",
    ]);
  });

  it("no informa éxito si la fila desaparece antes de guardar", async () => {
    const invitation = (await getInvitation(token))!;
    get.mockResolvedValueOnce({ data: { values: [row] } }).mockResolvedValueOnce({ data: { values: [] } });
    await expect(saveRsvp({ token, guests: invitation.guests.map((guest) => ({ guestId: guest.id, attending: false })), phone: "5512345678" })).rejects.toThrow(/disponible/);
    expect(batchUpdate).not.toHaveBeenCalled();
  });
});
