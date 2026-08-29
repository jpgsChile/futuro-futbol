"use client";

import { useEffect, useRef } from "react";

/**
 * MouseGlow — efecto de luz premium que sigue el cursor.
 * Dos capas: halo azul externo + núcleo rojo cálido.
 * pointer-events: none → no interfiere con clicks.
 * Montado una sola vez en el root layout.
 */
export default function MouseGlow() {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf: number;
    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    let tx = cx;
    let ty = cy;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const loop = () => {
      // Lerp suave: 8% por frame → lag fluido y elegante
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;

      const ox = cx - 400;
      const oy = cy - 400;
      if (outer.current) {
        outer.current.style.transform = `translate(${ox}px, ${oy}px)`;
      }

      const ix = cx - 200;
      const iy = cy - 200;
      if (inner.current) {
        inner.current.style.transform = `translate(${ix}px, ${iy}px)`;
      }

      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const base: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    borderRadius: "50%",
    pointerEvents: "none",
    zIndex: 0,
    willChange: "transform",
  };

  return (
    <>
      {/* Halo exterior — azul profundo */}
      <div
        ref={outer}
        aria-hidden="true"
        style={{
          ...base,
          width: 800,
          height: 800,
          background:
            "radial-gradient(circle, rgba(37,99,235,0.18) 0%, rgba(37,99,235,0.06) 45%, transparent 70%)",
        }}
      />
      {/* Núcleo interior — acento rojo cálido */}
      <div
        ref={inner}
        aria-hidden="true"
        style={{
          ...base,
          width: 400,
          height: 400,
          background:
            "radial-gradient(circle, rgba(220,38,38,0.13) 0%, rgba(220,38,38,0.04) 50%, transparent 70%)",
        }}
      />
    </>
  );
}
