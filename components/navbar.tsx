"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useEffect, useState } from "react";
import clsx from "clsx";
import { useAccount, useBalance, useChainId } from "wagmi";
import { avalancheFuji } from "viem/chains";
import { ConnectButton } from "@rainbow-me/rainbowkit";

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
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={clsx("nav-link", isActive && "nav-link-active")}
      aria-current={isActive ? "page" : undefined}
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
  const { data: bal } = useBalance({ address, query: { enabled: !!address } });

  const isCorrectChain = chainId === avalancheFuji.id;
  const showNetworkPill = mounted && !!address;
  const networkLabel = isCorrectChain ? "Red compatible ✓" : `Red: ${chainId ?? "—"}`;
  const balFormatted =
    mounted && address && bal?.value != null
      ? (Number(bal.value) / 1e18).toFixed(3)
      : null;

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <Link href="/" className="navbar-brand">
          <span className="navbar-logo">
            <span className="navbar-logo-ring" aria-hidden="true" />
            <span className="navbar-logo-dot" aria-hidden="true" />
          </span>
          <div className="navbar-brand-name">
            <span>LigaX</span>
            <span className="navbar-brand-sub">Fútbol. Organizado.</span>
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
          {showNetworkPill && (
            <span className={clsx("pill", isCorrectChain ? "pill-ok" : "pill-warn")}>
              {networkLabel}
            </span>
          )}
          {balFormatted && (
            <span className="pill">{balFormatted}</span>
          )}
          <ConnectButton showBalance={false} accountStatus="avatar" />
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
          {mounted && (
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", padding: "10px 20px", borderBottom: "1px solid var(--color-border)" }}>
              {showNetworkPill && (
                <span className={clsx("pill", isCorrectChain ? "pill-ok" : "pill-warn")}>
                  {isCorrectChain ? "Red compatible ✓" : "Red no compatible"}
                </span>
              )}
              {balFormatted && <span className="pill">{balFormatted}</span>}
              <ConnectButton showBalance={false} accountStatus="address" />
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
