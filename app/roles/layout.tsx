import { ReactNode } from "react";

/**
 * Sub-layout para /roles/*
 * Entidad: Liga — la gestión de roles es responsabilidad del administrador de liga.
 */
export default function RolesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="entity-league" style={{ display: "contents" }}>
      {children}
    </div>
  );
}
