"use client";

import { useEffect, useRef } from "react";

function HUDChip({
  children,
  dot,
  color = "dim",
}: {
  children: React.ReactNode;
  dot?: boolean;
  color?: "lime" | "blue" | "cyan" | "dim";
}) {
  return (
    <span className={`ff-chip ff-chip-${color}`}>
      {dot && <span className="ff-chip-dot" />}
      {children}
    </span>
  );
}

export default function HUDBar() {
  const clockRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const tick = () => {
      if (!clockRef.current) return;
      const d = new Date();
      const h = String(d.getUTCHours()).padStart(2, "0");
      const m = String(d.getUTCMinutes()).padStart(2, "0");
      const s = String(d.getUTCSeconds()).padStart(2, "0");
      clockRef.current.textContent = `${h}:${m}:${s} UTC`;
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="ff-hero-hud-top" aria-hidden="true">
      <div className="ff-hud-cluster">
        <HUDChip dot color="lime">SYSTEM ONLINE</HUDChip>
        <HUDChip color="dim">AVALANCHE · FUJI</HUDChip>
        <HUDChip color="dim">CHAIN 43113</HUDChip>
      </div>
      <div className="ff-hud-cluster">
        <span ref={clockRef} className="ff-hud-time">00:00:00 UTC</span>
        <HUDChip color="cyan">v2.0.0-alpha</HUDChip>
      </div>
    </div>
  );
}
