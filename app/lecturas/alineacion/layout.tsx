import { ReactNode } from "react";

/**
 * Sub-layout para /lecturas/alineacion
 * Entidad: Club — las alineaciones corresponden al club.
 */
export default function LecturaAlineacionLayout({ children }: { children: ReactNode }) {
  return (
    <div className="entity-club" style={{ display: "contents" }}>
      {children}
    </div>
  );
}
