"use client";

import { useAccount, useReadContract } from "wagmi";
import { useEffect, useState } from "react";
import { CONTRACTS } from "@/lib/contracts";
import { FFRolesAbi } from "@/abi/FFRoles";

/**
 * QuickChecks — Panel de estado de conexión simplificado.
 *
 * OPTIMIZACIONES (mantenidas):
 * 1. Patron mounted anti-SSR: evita hydration mismatch.
 * 2. useReadContract solo ejecuta si está conectado.
 */
export default function QuickChecks() {
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

  // Skeleton antes de montar
  if (!mounted) {
    return (
      <div className="card" style={{ minHeight: 100 }}>
        <h3 style={{ marginBottom: 12, fontSize: 15 }}>Estado de conexión</h3>
        <div style={{ opacity: 0.3, fontSize: 13 }}>Cargando…</div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 style={{ marginBottom: 14, fontSize: 15 }}>Estado de conexión</h3>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
        <StatusItem
          ok={isConnected}
          label={isConnected ? "Wallet conectada" : "Wallet desconectada"}
        />
        {isConnected && (
          <StatusItem
            ok={!!hasLeague}
            label={hasLeague ? "Rol de liga verificado ✓" : "Sin rol de liga asignado"}
          />
        )}
      </ul>
    </div>
  );
}

function StatusItem({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
      <span style={{
        width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
        background: ok ? "var(--color-success-text, #4ade80)" : "var(--color-text-dim, #555)",
        boxShadow: ok ? "0 0 6px var(--color-success-text, #4ade80)" : "none",
        transition: "background 0.2s ease",
      }} />
      <span style={{ color: ok ? "var(--color-text)" : "var(--color-text-muted)" }}>{label}</span>
    </li>
  );
}
