import { ReactNode } from "react";

/**
 * Sub-layout para /lecturas/liga/*
 * Activa los tokens CSS de Liga (entity-league).
 */
export default function LecturaLigaLayout({ children }: { children: ReactNode }) {
  return (
    <div className="entity-league" style={{ display: "contents" }}>
      {children}
    </div>
  );
}
