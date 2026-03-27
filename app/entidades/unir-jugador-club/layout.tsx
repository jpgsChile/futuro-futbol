import { ReactNode } from "react";

/**
 * Sub-layout para /entidades/unir-jugador-club
 * Entidad: Club — tokens verdes entity-club
 * Unir jugador a club es una acción de gestión de club, no de liga.
 */
export default function UnirJugadorClubLayout({ children }: { children: ReactNode }) {
  return (
    <div className="entity-club" style={{ display: "contents" }}>
      {children}
    </div>
  );
}
