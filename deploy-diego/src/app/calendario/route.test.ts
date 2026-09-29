import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("wedding calendar", () => {
  it("exports reception time in UTC without the private civil ceremony", async () => {
    const response = GET(new Request("http://localhost/calendario"));
    const raw = await response.text();
    const content = raw.replace(/\r\n /g, "");
    expect(response.headers.get("Content-Type")).toContain("text/calendar");
    expect(content).toContain("DTSTART:20261122T010000Z");
    expect(content).not.toContain("Ceremonia civil");
    expect(content).toContain("Península Eventos");
    expect(raw.split("\r\n").every(line => Buffer.byteLength(line) <= 75)).toBe(true);
  });
  it("includes the 6 pm civil ceremony for civil guests", async () => {
    const content = (await GET(new Request("http://localhost/calendario?civil=1")).text()).replace(/\r\n /g, "");
    expect(content).toContain("DTSTART:20261122T000000Z");
    expect(content).toContain("Ceremonia civil");
  });
});
