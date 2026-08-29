"use client";

import { useAccount, useReadContract } from "wagmi";
import { useEffect, useState } from "react";
import { CONTRACTS } from "@/lib/contracts";
import { FFRolesAbi } from "@/abi/FFRoles";
import dynamic from "next/dynamic";

const Connect = dynamic(() => import("@/components/Connect"), { ssr: false });

/**
 * WalletPanel — Panel derecho de la home.
 *
 * Agrupa en una sola columna sticky:
 *  1. Estado de conexión con indicadores visuales
 *  2. Rol on-chain (si conectado)
 *  3. Bloque de conexión / desconexión (Connect embebido)
 *
 * Diseño: glass card con jerarquía visual real.
 * No expone errores técnicos del provider.
 */
export default function WalletPanel() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { address, isConnected } = useAccount();

  const { data: leagueRole } = useReadContract({
    address: CONTRACTS.FFRoles as `0x${string}`,
    abi: FFRolesAbi,
    functionName: "LEAGUE_ROLE",
    query: { enabled: mounted && isConnected },
  });

  const { data: hasLeague } = useReadContract({
    address: CONTRACTS.FFRoles as `0x${string}`,
    abi: FFRolesAbi,
    functionName: "hasRole",
    args: (leagueRole && address
      ? [leagueRole as `0x${string}`, address]
      : undefined) as readonly [`0x${string}`, `0x${string}`] | undefined,
    query: { enabled: mounted && !!leagueRole && !!address },
  });

  // ── Skeleton SSR ─────────────────────────────────────────
  if (!mounted) {
    return (
      <div className="wallet-panel">
        <div className="wallet-panel-header">
          <span className="wallet-panel-title">Tu acceso a LigaX</span>
        </div>
        <div className="wallet-panel-skeleton" aria-hidden="true">
          <div className="skeleton-line" style={{ width: "60%" }} />
          <div className="skeleton-line" style={{ width: "80%" }} />
          <div className="skeleton-line" style={{ width: "45%" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-panel">

      {/* ── Encabezado ──────────────────────────────────── */}
      <div className="wallet-panel-header">
        <span className="wallet-panel-title">Tu acceso a LigaX</span>
        <span className={`wallet-panel-badge ${isConnected ? "wallet-panel-badge-ok" : "wallet-panel-badge-idle"}`}>
          {isConnected ? "Activo" : "Ingresa para comenzar"}
        </span>
      </div>

      {/* ── Estado del perfil ────────────────────────── */}
      <ul className="wallet-status-list">
        <WalletStatusItem
          ok={isConnected}
          label={isConnected ? "Sesión activa" : "No has iniciado sesión"}
          sublabel={isConnected && address ? `${address.slice(0, 6)}…${address.slice(-4)}` : ""}
        />
        {isConnected && (
          <WalletStatusItem
            ok={!!hasLeague}
            label={hasLeague ? "Administrador de liga" : "Perfil de participante"}
            sublabel={hasLeague ? "Acceso completo verificado ✓" : "Contacta al organizador para más permisos"}
          />
        )}
      </ul>

      {/* ── Divisor ───────────────────────────────────── */}
      <div className="wallet-panel-divider" />

      {/* ── Bloque de acceso ─────────────────────────── */}
      <div className="wallet-panel-connect">
        {!isConnected && (
          <p className="wallet-panel-connect-hint">
            Inicia sesión para acceder a tu liga, club o perfil de jugador.
          </p>
        )}
        <Connect />
      </div>

    </div>
  );
}

function WalletStatusItem({
  ok,
  label,
  sublabel,
}: {
  ok: boolean;
  label: string;
  sublabel?: string;
}) {
  return (
    <li className="wallet-status-item">
      <span
        className={`wallet-status-dot ${ok ? "wallet-status-dot-ok" : "wallet-status-dot-idle"}`}
        aria-hidden="true"
      />
      <div className="wallet-status-text">
        <span className="wallet-status-label">{label}</span>
        {sublabel && (
          <span className="wallet-status-sublabel">{sublabel}</span>
        )}
      </div>
    </li>
  );
}
