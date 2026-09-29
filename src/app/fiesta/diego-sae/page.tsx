import type { Metadata } from "next";
import { DiegoPartyInvitation } from "@/components/party/DiegoPartyInvitation";

export const metadata: Metadata = {
  title: "Diego Sae | Invitación de cumpleaños",
  description: "Acompáñanos a celebrar el cumpleaños de Diego Sae.",
  robots: { index: false, follow: false },
};

export default function DiegoPartyPage() {
  return <DiegoPartyInvitation />;
}
