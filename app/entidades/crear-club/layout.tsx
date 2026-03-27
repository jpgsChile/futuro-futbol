import { ReactNode } from "react";

/**
 * Sub-layout para /entidades/crear-club
 * Entidad: Club — tokens verdes entity-club
 */
export default function CrearClubLayout({ children }: { children: ReactNode }) {
  return (
    <div className="entity-club" style={{ display: "contents" }}>
      {children}
    </div>
  );
}
