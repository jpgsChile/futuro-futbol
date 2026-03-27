"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useEffect, useState } from "react";
import clsx from "clsx";
import { useAccount, useBalance, useChainId, useSwitchChain } from "wagmi";
import { avalancheFuji } from "viem/chains";

type Item = { label: string; href: string };
type Section = { title: string; icon: string; items: Item[] };

// Fuera del componente: constante inmutable, no se recrea en cada render
const SECTIONS: Section[] = [
  {
    title: "Entidades",
    icon: "🏟️",
    items: [
      { label: "Crear nueva liga", href: "/entidades/crear-liga" },
      { label: "Crear nuevo club", href: "/entidades/crear-club" },
      { label: "Registrar jugador", href: "/entidades/registrar-jugador" },
      { label: "Unir jugador a un club", href: "/entidades/unir-jugador-club" },
    ],
  },
  {
    title: "Partidos",
    icon: "⚽",
    items: [
      { label: "Crear partido básico", href: "/partidos/crear" },
      { label: "Partido con metadata IPFS", href: "/partidos/crear-ipfs" },
      { label: "Finalizar partido", href: "/partidos/finalizar" },
    ],
  },
  {
    title: "Alineaciones",
    icon: "📋",
    items: [
      { label: "Agregar jugador a alineación", href: "/alineaciones/agregar" },
      { label: "Registrar salida de jugador", href: "/alineaciones/salida" },
      { label: "Registrar evento básico", href: "/eventos/registrar" },
      { label: "Evento con evidencia IPFS", href: "/eventos/registrar-ipfs" },
      { label: "Evento + reputación", href: "/eventos/registrar-reputacion" },
    ],
  },
  {
    title: "Roles",
    icon: "🔐",
    items: [
      { label: "Asignar rol a usuario", href: "/roles/asignar" },
      { label: "Verificar si usuario tiene rol", href: "/roles/verificar" },
      { label: "Crear attestation", href: "/attestations/crear" },
      { label: "Elevar verificación", href: "/attestations/elevar" },
    ],
  },
  {
    title: "Consultas",
    icon: "🔍",
    items: [
      { label: "Obtener liga", href: "/lecturas/liga" },
      { label: "Obtener club", href: "/lecturas/club" },
      { label: "Obtener jugador", href: "/lecturas/jugador" },
      { label: "Obtener partido", href: "/lecturas/partido" },
      { label: "Obtener alineación", href: "/lecturas/alineacion" },
      { label: "Obtener evento", href: "/lecturas/evento" },
    ],
  },
];

/**
 * NavLink — componente puro que recibe pathname como prop.
 *
 * OPTIMIZACIÓN CLAVE: el patrón anterior usaba usePathname()
 * dentro de cada <ActiveLink> — con ~20 links en el nav, eran
 * 20 suscripciones individuales al router. Cada cambio de ruta
 * disparaba 20 re-renders del nav completo.
 *
 * Ahora usePathname() se llama UNA sola vez en <Navbar> y se
 * pasa como prop. memo() evita re-render si href y pathname no
 * cambiaron.
 */
const NavLink = memo(function NavLink({
  href, children, pathname,
}: {
  href: string;
  children: React.ReactNode;
  pathname: string;
}) {
  return (
    <Link
      href={href}
      className={clsx("nav-link", pathname === href && "nav-link-active")}
    >
      {children}
    </Link>
  );
});

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Una sola suscripción a pathname para todo el navbar
  const pathname = usePathname();

  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: switching } = useSwitchChain();
  const { data: bal } = useBalance({ address, query: { enabled: !!address } });

  const isCorrectChain = chainId === avalancheFuji.id;
  // Mostrar indicador de red solo cuando hay wallet conectada
  const showNetworkPill = mounted && !!address;
  const networkLabel = isCorrectChain ? "Red compatible ✓" : `Red: ${chainId ?? "—"}`;
  const balFormatted =
    mounted && address && bal?.value != null
      ? (Number(bal.value) / 1e18).toFixed(3)
      : null;

  const handleSwitchChain = async () => {
    if (address) {
      switchChain({ chainId: avalancheFuji.id });
      return;
    }
    try {
      // @ts-ignore
      const eth = typeof window !== "undefined" ? (window as any).ethereum : undefined;
      if (eth?.request) {
        await eth.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xa869" }],
        });
      }
    } catch {
      // ignore
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <Link href="/" className="navbar-brand">
          <div className="navbar-brand-icon">⚽</div>
          <div className="navbar-brand-name">
            <span>LigaX</span>
          </div>
        </Link>

        {/* Desktop nav — pathname pasado como prop, no como hook individual */}
        <nav className="nav-desktop nav-sections">
          {SECTIONS.map((s) => (
            <div key={s.title} className="group nav-item">
              <button className="nav-btn">
                <span style={{ marginRight: 4 }}>{s.icon}</span>
                {s.title}
              </button>
              <div className="nav-dropdown">
                {s.items.map((it) => (
                  <NavLink key={it.href} href={it.href} pathname={pathname}>
                    {it.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="nav-desktop nav-actions">
          {/* Pill de red: solo visible con wallet conectada */}
          {showNetworkPill && (
            <span className={clsx("pill", isCorrectChain ? "pill-ok" : "pill-warn")}>
              {networkLabel}
            </span>
          )}
          {balFormatted && (
            <span className="pill">
              {balFormatted}
            </span>
          )}
          {/* Botón de cambio de red: solo si conectado y red incorrecta */}
          {showNetworkPill && !isCorrectChain && (
            <button
              className="btn-secondary"
              onClick={handleSwitchChain}
              disabled={switching}
            >
              {switching ? "Cambiando…" : "Cambiar red"}
            </button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="nav-burger nav-mobile-toggle"
          aria-label="Abrir menú"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="nav-mobile">
          {/* Estado de red en mobile: solo si hay wallet conectada */}
          {showNetworkPill && (
            <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "10px 20px", borderBottom: "1px solid var(--color-border)" }}>
              <span className={clsx("pill", isCorrectChain ? "pill-ok" : "pill-warn")}>
                {isCorrectChain ? "Red compatible ✓" : "Red no compatible"}
              </span>
              {balFormatted && <span className="pill">{balFormatted}</span>}
              {!isCorrectChain && (
                <button
                  className="btn-secondary"
                  onClick={handleSwitchChain}
                  disabled={switching}
                  style={{ fontSize: 12 }}
                >
                  {switching ? "Cambiando…" : "Cambiar red"}
                </button>
              )}
            </div>
          )}
          {SECTIONS.map((s) => (
            <details key={s.title}>
              <summary className="nav-mobile-summary">{s.icon} {s.title}</summary>
              <div className="nav-mobile-list">
                {s.items.map((it) => (
                  <NavLink key={it.href} href={it.href} pathname={pathname}>
                    {it.label}
                  </NavLink>
                ))}
              </div>
            </details>
          ))}
        </div>
      )}
    </header>
  );
}
