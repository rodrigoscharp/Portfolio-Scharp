import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Rodrigo Scharp · Links";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  const photo = await readFile(join(process.cwd(), "public/images/rodrigo-square.jpg"));
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "72px 88px",
          background:
            "radial-gradient(70% 90% at 0% 0%, rgba(253,96,26,0.45) 0%, rgba(9,9,13,0) 60%), radial-gradient(60% 80% at 100% 100%, rgba(123,47,242,0.4) 0%, rgba(9,9,13,0) 60%), #09090d",
          color: "#f6f3ea",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ display: "flex", fontSize: 56, fontWeight: 900, letterSpacing: -2 }}>
            S<span style={{ color: "#fd601a" }}>.</span>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 40,
              fontSize: 96,
              fontWeight: 900,
              letterSpacing: -4,
              lineHeight: 0.95,
            }}
          >
            Rodrigo Scharp
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 32, color: "rgba(246,243,234,0.7)" }}>
            Portfólio · Muno · MyHub
          </div>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              marginTop: 40,
              padding: "12px 26px",
              borderRadius: 999,
              background: "#fd601a",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            links.rodrigoscharp.com
          </div>
        </div>

        <div
          style={{
            display: "flex",
            padding: 10,
            borderRadius: 999,
            background: "linear-gradient(135deg, #ffa257, #fd601a 45%, #7b2ff2)",
          }}
        >
          <img
            src={src}
            alt=""
            width={340}
            height={340}
            style={{ borderRadius: 999, border: "8px solid #09090d" }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
