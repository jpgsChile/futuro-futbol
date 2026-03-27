import { ReactNode } from "react";

/**
 * Sub-layout para /lecturas/partido
 * Entidad: Liga — los partidos pertenecen a la liga.
 */
export default function LecturaPartidoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="entity-league" style={{ display: "contents" }}>
      {children}
    </div>
  );
}
