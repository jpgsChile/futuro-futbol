"use client";

import { useState, ReactNode } from "react";

interface GlowButtonProps {
  children: ReactNode;
  variant?: "primary" | "ghost";
  icon?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function GlowButton({
  children,
  variant = "primary",
  icon,
  href,
  onClick,
  className = "",
}: GlowButtonProps) {
  const [pressed, setPressed] = useState(false);

  const cls = `ff-btn ff-btn-${variant}${pressed ? " is-pressed" : ""}${className ? ` ${className}` : ""}`;

  const inner = (
    <>
      <span className="ff-btn-bg" />
      <span className="ff-btn-rim" />
      <span className="ff-btn-content">
        {icon && <span className="ff-btn-icon">{icon}</span>}
        <span>{children}</span>
        <span className="ff-btn-arrow">→</span>
      </span>
      <span className="ff-btn-glow" />
    </>
  );

  const handlers = {
    onMouseDown: () => setPressed(true),
    onMouseUp: () => setPressed(false),
    onMouseLeave: () => setPressed(false),
  };

  if (href) {
    return (
      <a href={href} className={cls} {...handlers}>
        {inner}
      </a>
    );
  }

  return (
    <button type="button" className={cls} onClick={onClick} {...handlers}>
      {inner}
    </button>
  );
}
