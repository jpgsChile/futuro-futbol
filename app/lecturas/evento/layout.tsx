import { ReactNode } from "react";

/**
 * Sub-layout para /lecturas/evento
 * Entidad: Club — los eventos de partido son del club.
 */
export default function LecturaEventoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="entity-club" style={{ display: "contents" }}>
      {children}
    </div>
  );
}
