import { ReactNode } from "react";

/**
 * Sub-layout para /lecturas/club/*
 * Activa los tokens CSS de Club (entity-club).
 */
export default function LecturaClubLayout({ children }: { children: ReactNode }) {
  return (
    <div className="entity-club" style={{ display: "contents" }}>
      {children}
    </div>
  );
}
