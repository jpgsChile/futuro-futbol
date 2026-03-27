import { ReactNode } from "react";

/**
 * Layout raíz de /entidades/
 * Neutro — sin clase entity-*
 * Cada sub-ruta tiene su propio layout con la clase correcta.
 */
export default function EntidadesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
