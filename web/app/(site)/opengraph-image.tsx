import { ImageResponse } from "next/og";

export const alt = "Rodrigo Scharp — Java Back-end Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "72px 80px",
          background:
            "radial-gradient(120% 100% at 85% 0%, #ffe4d0 0%, #fffcf3 55%, #fffcf3 100%)",
          color: "#030309",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: 2,
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          Rodrigo Scharp
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              fontSize: 150,
              fontWeight: 900,
              letterSpacing: -8,
              lineHeight: 0.92,
              color: "#fd601a",
            }}
          >
            SOFTWARE
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 150,
              fontWeight: 900,
              letterSpacing: -8,
              lineHeight: 0.92,
            }}
          >
            ENGINEER
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 32,
              fontSize: 30,
              fontWeight: 300,
              color: "#222222",
            }}
          >
            Java · Spring Boot · AWS · Tech Lead · Founder &amp; CTO
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
