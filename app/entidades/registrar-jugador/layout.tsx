import { ReactNode } from "react";

/**
 * Sub-layout para /entidades/registrar-jugador
 * Entidad: Jugador — tokens ámbar entity-player
 */
export default function RegistrarJugadorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="entity-player" style={{ display: "contents" }}>
      {children}
    </div>
  );
}
