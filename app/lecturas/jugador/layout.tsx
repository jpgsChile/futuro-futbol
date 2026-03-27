import { ReactNode } from "react";

/**
 * Sub-layout para /lecturas/jugador/*
 * Activa los tokens CSS de Jugador (entity-player).
 */
export default function LecturaJugadorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="entity-player" style={{ display: "contents" }}>
      {children}
    </div>
  );
}
