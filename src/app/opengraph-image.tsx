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
          justifyContent: "center",
          overflow: "hidden",
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
            left: -280,
            top: -210,
            width: 690,
          }}
        />
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            width: 520,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse requires a standard image element. */}
          <img
            alt="Monograma de Alei y Scarlett"
            height={250}
            src={monogram}
            style={{ objectFit: "contain", width: 250 }}
          />
          <div style={{ color: "#bd7c18", fontSize: 24, letterSpacing: 4, marginTop: 8 }}>
            NOS CASAMOS
          </div>
          <div style={{ fontFamily: "serif", fontSize: 62, lineHeight: 1.02, marginTop: 15 }}>
            Alei &amp; Scarlett
          </div>
          <div style={{ color: "#786c61", fontSize: 25, marginTop: 20 }}>
            21 de noviembre de 2026 · Santiago, Nuevo León
          </div>
        </div>
      </div>
    ),
    size,
  );
}
