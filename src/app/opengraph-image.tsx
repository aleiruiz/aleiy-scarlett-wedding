import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

const monogramData = await readFile(
  join(process.cwd(), "public", "wedding-monogram.png"),
  "base64",
);
const monogram = `data:image/png;base64,${monogramData}`;

export const alt = "Alei y Scarlett — nuestra boda";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#fffdf9",
          color: "#26201c",
          display: "flex",
          height: "100%",
          justifyContent: "space-between",
          overflow: "hidden",
          padding: "58px 88px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "#f3bf60",
            borderRadius: "50%",
            height: 690,
            opacity: 0.2,
            position: "absolute",
            right: -220,
            top: -185,
            width: 690,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 625 }}>
          <div style={{ color: "#bd7c18", fontSize: 31, letterSpacing: 5 }}>
            NOS CASAMOS
          </div>
          <div style={{ fontFamily: "serif", fontSize: 96, lineHeight: 1.02, marginTop: 25 }}>
            Alei &amp; Scarlett
          </div>
          <div style={{ fontSize: 33, marginTop: 36 }}>
            21 de noviembre de 2026
          </div>
          <div style={{ color: "#786c61", fontSize: 27, marginTop: 14 }}>
            Santiago, Nuevo León
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse requires a standard image element. */}
        <img
          alt="Monograma de Alei y Scarlett"
          height={390}
          src={monogram}
          style={{ objectFit: "contain", width: 390 }}
        />
      </div>
    ),
    size,
  );
}
