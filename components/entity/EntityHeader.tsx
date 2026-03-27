import { memo } from "react";
import type { CSSProperties } from "react";

interface EntityHeaderProps {
  icon: string;
  label: string;
  title: string;
  pill?: string;
  style?: CSSProperties;
}

/**
 * EntityHeader — Encabezado de sección por entidad.
 * memo: componente puro, mismo output para mismas props.
 * Evita re-render al cambiar estado del padre (wagmi hooks).
 */
const EntityHeader = memo(function EntityHeader({
  icon, label, title, pill, style,
}: EntityHeaderProps) {
  return (
    <div className="entity-header" style={style}>
      <div className="entity-header-icon">{icon}</div>
      <div>
        <div className="entity-header-label">{label}</div>
        <div className="entity-header-title">{title}</div>
      </div>
      {pill && (
        <span className="pill-entity" style={{ marginLeft: "auto" }}>
          {pill}
        </span>
      )}
    </div>
  );
});

export default EntityHeader;
