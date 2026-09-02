import { beforeEach, describe, expect, it } from "vitest";
import { checkRateLimit, resetRateLimitsForTests } from "./rate-limit";

describe("checkRateLimit", () => {
  beforeEach(resetRateLimitsForTests);

  it("blocks attempts above the limit", () => {
    const options = { limit: 2, windowMs: 10_000 };
    expect(checkRateLimit("guest", options, 1_000).allowed).toBe(true);
    expect(checkRateLimit("guest", options, 1_001).allowed).toBe(true);
    expect(checkRateLimit("guest", options, 1_002)).toEqual({
      allowed: false,
      retryAfterSeconds: 10,
    });
  });

  it("starts a new window after expiry", () => {
    const options = { limit: 1, windowMs: 1_000 };
    checkRateLimit("guest", options, 1_000);
    expect(checkRateLimit("guest", options, 2_000).allowed).toBe(true);
  });
});
