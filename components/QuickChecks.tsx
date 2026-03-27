"use client";

import { useAccount, useChainId, useReadContract } from "wagmi";
import { useEffect, useState } from "react";
import { CONTRACTS } from "@/lib/contracts";
import { FFRolesAbi } from "@/abi/FFRoles";

const FUJI_ID = 43113;
const allContractsLoaded = Object.values(CONTRACTS).every(
  (a) => a !== "0x0000000000000000000000000000000000000000"
);

/**
 * QuickChecks — Panel de estado rápido de wallet.
 *
 * OPTIMIZACIONES:
 * 1. Patron mounted anti-SSR: evita hydration mismatch entre
 *    server (isConnected=false) y client (isConnected=true).
 * 2. allContractsLoaded calculado fuera del componente — es
 *    una constante que no depende de estado ni props.
 * 3. useReadContract solo ejecuta si leagueRole y address están
 *    disponibles (condición ya existente, mantenida).
 */
export default function QuickChecks() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const { data: leagueRole } = useReadContract({
    address: CONTRACTS.FFRoles as `0x${string}`,
    abi: FFRolesAbi,
    functionName: "LEAGUE_ROLE",
    // Solo fetch cuando el componente está montado y conectado
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

  const isCorrectNetwork = chainId === FUJI_ID;

  // Skeleton antes de montar — misma altura para evitar layout shift
  if (!mounted) {
    return (
      <div className="card" style={{ minHeight: 120 }}>
        <h3 style={{ marginBottom: 12, fontSize: 15 }}>Estado rápido</h3>
        <div style={{ opacity: 0.3, fontSize: 13 }}>Cargando…</div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 style={{ marginBottom: 14, fontSize: 15 }}>Estado rápido</h3>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
        <StatusItem
          ok={isConnected}
          label={isConnected ? "Wallet conectada" : "Wallet desconectada"}
        />
        <StatusItem
          ok={isCorrectNetwork}
          label={isCorrectNetwork ? `Red Fuji (${chainId}) ✓` : `Red ${chainId ?? "—"} — esperado: 43113`}
        />
        <StatusItem
          ok={allContractsLoaded}
          label={allContractsLoaded ? "Contratos cargados" : "Faltan contratos"}
        />
        <StatusItem
          ok={!!hasLeague}
          label={isConnected ? (hasLeague ? "Rol LEAGUE_ROLE ✓" : "Sin rol de liga") : "Conecta para ver roles"}
        />
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
