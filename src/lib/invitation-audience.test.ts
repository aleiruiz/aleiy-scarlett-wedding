import { describe, expect, it } from "vitest";
import { wedding } from "../content/wedding";
import { forInvitation } from "./invitation-audience";

describe("invitation audience", () => {
  it("hides civil ceremony and early arrival unless explicitly invited", () => {
    for (const civil of [false, undefined]) {
      expect(forInvitation(wedding.events, civil).map((x) => x.type)).toEqual(["Recepción"]);
      expect(forInvitation(wedding.schedule, civil).map((x) => x.time)).toEqual(["7:00 p. m.", "7:30 p. m.", "8:30 p. m.", "9:00 p. m.", "10:15 p. m.", "10:30 p. m."]);
    }
  });
  it("includes the full schedule for civil guests", () => {
    expect(forInvitation(wedding.events, true)).toHaveLength(2);
    expect(forInvitation(wedding.schedule, true)).toHaveLength(7);
  });
});
