import Image from "next/image";

export function Monogram({ className = "", tone = "gold" }: {
  className?: string;
  tone?: "gold" | "white" | "black";
}) {
  return <Image src="/wedding-monogram.png" alt="Scarlett y Alei" width={1230} height={1279}
    className={`wedding-monogram monogram-${tone} ${className}`} sizes="(max-width: 600px) 240px, 320px" />;
}
