import { ReactNode } from "react";

/**
 * Sub-layout para /alineaciones/*
 * Activa los tokens CSS de Club (entity-club).
 * Las alineaciones son responsabilidad del club/equipo.
 */
export default function AlineacionesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="entity-club" style={{ display: "contents" }}>
      {children}
    </div>
  );
}

