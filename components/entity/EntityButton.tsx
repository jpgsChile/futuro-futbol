import { memo } from "react";
import type { MouseEventHandler, ReactNode } from "react";

interface EntityButtonProps {
  children: ReactNode;
  type?: "submit" | "button" | "reset";
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

/**
 * EntityButton — Botón primario contextualizado por entidad.
 * memo: el botón no contiene estado propio ni efectos.
 * Solo re-renderiza cuando cambian children, disabled u onClick.
 */
const EntityButton = memo(function EntityButton({
  children, type = "button", disabled = false, onClick,
}: EntityButtonProps) {
  return (
    <button
      type={type}
      className="btn-entity"
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
});

export default EntityButton;
