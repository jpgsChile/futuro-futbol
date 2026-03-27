import { ReactNode } from "react";

/**
 * Sub-layout para /eventos/*
 * Activa los tokens CSS de Club (entity-club).
 * Los eventos de partido son gestionados a nivel de club.
 */
export default function EventosLayout({ children }: { children: ReactNode }) {
  return (
    <div className="entity-club" style={{ display: "contents" }}>
      {children}
    </div>
  );
}
