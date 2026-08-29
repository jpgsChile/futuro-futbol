import { ReactNode } from "react";

/**
 * Sub-layout para /entidades/crear-liga
 * Entidad: Liga — tokens azules entity-league
 */
export default function CrearLigaLayout({ children }: { children: ReactNode }) {
  return (
    <div className="entity-league" style={{ display: "contents" }}>
      {children}
    </div>
  );
}
