import { NextResponse } from "next/server";
import { getInvitation } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;
    const invitation = await getInvitation(token);

    if (!invitation) {
      return NextResponse.json(
        { error: "Invitación no encontrada o vencida." },
        { status: 404 },
      );
    }

    return NextResponse.json(invitation, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    console.error("Unable to load invitation", error);
    return NextResponse.json(
      { error: "No pudimos consultar la invitación." },
      { status: 500 },
    );
  }
}
