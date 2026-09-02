import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WeddingInvitation } from "@/components/wedding/WeddingInvitation";
import { getInvitation } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Alei & Scarlett | Invitación",
  description: "Tenemos una invitación especial para nuestra boda.",
  robots: { index: false, follow: false },
};

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invitation = await getInvitation(token);

  if (!invitation) notFound();

  return <WeddingInvitation invitation={invitation} />;
}
