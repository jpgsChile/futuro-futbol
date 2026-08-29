import { ReactNode } from "react";

/**
 * Sub-layout para /partidos/*
 * Activa los tokens CSS de Liga (entity-league).
 * Los partidos son gestionados a nivel de liga.
 */
export default function PartidosLayout({ children }: { children: ReactNode }) {
  return (
    <div className="entity-league" style={{ display: "contents" }}>
      {children}
    </div>
  );
}
