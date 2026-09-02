import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { saveRsvp } from "@/lib/google-sheets";
import { rsvpSchema } from "@/lib/rsvp-validation";
import { AppError } from "@/lib/app-error";
import { checkRateLimit } from "@/lib/rate-limit";

const RATE_LIMIT = { limit: 10, windowMs: 10 * 60 * 1000 };

function requestClient(request: Request) {
  return (
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const submission = rsvpSchema.parse(body);
    const rateLimit = checkRateLimit(
      `${requestClient(request)}:${submission.token}`,
      RATE_LIMIT,
    );
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo." },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        },
      );
    }
    const result = await saveRsvp(submission);

    return NextResponse.json({
      ok: true,
      demo: result.demo,
      message: result.demo
        ? "Modo demostración: la respuesta fue validada, pero no se guardó."
        : "Tu confirmación quedó guardada.",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Revisa los datos de tu confirmación." },
        { status: 400 },
      );
    }

    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Unable to save RSVP", error);
    return NextResponse.json(
      { error: "No pudimos guardar tu confirmación. Inténtalo de nuevo." },
      { status: 500 },
    );
  }
}
