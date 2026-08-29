import { memo } from "react";
import type { CSSProperties, ReactNode } from "react";

interface EntityCardProps {
  children: ReactNode;
  accent?: boolean;
  sectionTitle?: string;
  compact?: boolean;
  style?: CSSProperties;
  className?: string;
}

/**
 * EntityCard — Tarjeta con soporte de tokens de entidad.
 * memo: el layout de la card no depende de estado wagmi;
 * solo children puede cambiar (y React compara por referencia).
 */
const EntityCard = memo(function EntityCard({
  children, accent = false, sectionTitle, compact = false, style, className,
}: EntityCardProps) {
  return (
    <div
      className={`card${className ? ` ${className}` : ""}`}
      style={{
        ...(accent ? { borderColor: "var(--entity-accent-border)" } : {}),
        ...(compact ? { padding: "var(--space-4)" } : {}),
        ...style,
      }}
    >
      {sectionTitle && (
        <h3 style={{
          margin: "0 0 var(--space-4) 0", fontSize: 11, fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.08em",
          color: "var(--entity-accent-text)",
        }}>
          {sectionTitle}
        </h3>
      )}
      {children}
    </div>
  );
});

export default EntityCard;
