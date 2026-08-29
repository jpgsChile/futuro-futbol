"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useEffect, useState } from "react";

/**
 * Connect — Conexión de wallet con UX completa.
 *
 * Estados:
 * 1. SSR / pre-mount   → placeholder deshabilitado (anti-hydration)
 * 2. Sin provider      → mensaje amigable, botones deshabilitados
 * 3. Sin conectar      → botones de conector disponibles
 * 4. Conectando        → spinner + mensaje "Abriendo wallet…"
 * 5. Conectado         → card verde con dirección + botón Desconectar
 * 6. Error             → mensaje amigable (sin texto técnico crudo)
 *
 * Regla: no se toca lógica de wagmi. Solo UI/UX.
 */

/** Filtra y humaniza errores técnicos de wagmi / MetaMask */
function humanizeError(err: Error | null): string | null {
  if (!err) return null;
  const raw = String(err.message || err);

  // Errores que el usuario causó intencionalmente → no mostrar
  if (
    raw.toLowerCase().includes("user rejected") ||
    raw.toLowerCase().includes("user denied") ||
    raw.toLowerCase().includes("rejected the request")
  ) {
    return null; // Se canceló: no es un error, es una acción del usuario
  }

  // Provider técnico → mensaje genérico amigable
  if (
    raw.toLowerCase().includes("provider not found") ||
    raw.toLowerCase().includes("provider") ||
    raw.toLowerCase().includes("connector not found")
  ) {
    return "No se encontró la wallet. Asegurate de tener MetaMask o Core Wallet instalado.";
  }

  // Timeout o red → mensaje reconocible
  if (raw.toLowerCase().includes("timeout") || raw.toLowerCase().includes("network")) {
    return "No se pudo conectar. Verificá tu conexión a internet e intentá de nuevo.";
  }

  // Resto de errores: truncar si es muy largo
  const clean = raw.replace(/\(.*?\)/g, "").trim();
  return clean.length > 120 ? clean.slice(0, 117) + "…" : clean;
}

/** Devuelve el nombre amigable de un conector.
 *  Siempre normaliza 'Injected' → 'MetaMask' para una UX limpia.
 *  En entornos donde solo existe el conector genérico (Injected),
 *  este lo representa en la práctica. */
function friendlyName(name: string): string {
  if (name.toLowerCase() === "injected") return "MetaMask";
  return name;
}

export default function Connect() {
  const [mounted, setMounted] = useState(false);
  const [hasProvider, setHasProvider] = useState<boolean | null>(null);

  useEffect(() => {
    setMounted(true);
    const detected =
      typeof window !== "undefined" &&
      !!(window as { ethereum?: unknown }).ethereum;
    setHasProvider(detected);
  }, []);

  const { isConnected, address } = useAccount();
  const { connectors, connect, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();

  // Deduplicar: si hay MetaMask named + Injected, quedarse solo con MetaMask
  const visibleConnectors = (() => {
    const hasNamedMetaMask = connectors.some(
      (c) => c.name.toLowerCase() === "metamask"
    );
    if (hasNamedMetaMask) {
      return connectors.filter((c) => c.name.toLowerCase() !== "injected");
    }
    return connectors;
  })();

  // ── SSR placeholder ─────────────────────────────────────
  if (!mounted) {
    return (
      <button className="button" disabled style={{ opacity: 0.4, minWidth: 160 }}>
        Conectar wallet
      </button>
    );
  }

  // ── CONECTADO ───────────────────────────────────────────
  if (isConnected && address) {
    return (
      <div className="wallet-connected-card">
        {/* Indicador de estado */}
        <div className="wallet-connected-status">
          <span className="wallet-dot" />
          <span className="wallet-connected-label">Wallet conectada</span>
        </div>

        {/* Dirección truncada */}
        <div className="wallet-address" title={address}>
          {address.slice(0, 8)}…{address.slice(-6)}
        </div>

        {/* Acciones */}
        <div className="wallet-actions">
          <button
            className="btn-wallet-disconnect"
            onClick={() => disconnect()}
            title="Desconectar esta wallet de la app"
          >
            ⏏ Desconectar
          </button>
          {connectors.length > 1 && (
            <button
              className="btn-secondary"
              onClick={() => {
                disconnect();
                setTimeout(() => connect({ connector: connectors[0] }), 150);
              }}
              title="Cambiar a otra wallet"
            >
              Cambiar wallet
            </button>
          )}
        </div>

        <p className="wallet-connected-note">
          Para cambiar de cuenta, usá el selector de tu wallet directamente.
        </p>
      </div>
    );
  }

  // ── Humanizar error (puede ser null si fue rechazo del usuario) ─
  const friendlyError = humanizeError(error ?? null);

  // ── SIN PROVIDER ────────────────────────────────────────
  if (hasProvider === false) {
    return (
      <div style={{ display: "grid", gap: "var(--space-3)" }}>
        <div className="wallet-hint">
          <span className="wallet-hint-title">
            No se detectó una wallet compatible.
          </span>
          <span>
            Instalá MetaMask, Core Wallet u otra billetera EVM compatible para continuar.
          </span>
        </div>
        {visibleConnectors.map((c) => (
          <button key={c.uid} className="btn" disabled>
            Conectar {friendlyName(c.name)}
          </button>
        ))}
      </div>
    );
  }

  // ── CON PROVIDER — SIN CONECTAR / CONECTANDO ────────────
  return (
    <div style={{ display: "grid", gap: "var(--space-3)" }}>
      <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
        {visibleConnectors.map((c) => (
          <button
            key={c.uid}
            className="button"
            onClick={() => connect({ connector: c })}
            disabled={isPending}
            title={`Conectar con ${friendlyName(c.name)}`}
            style={{ flex: "1 1 auto" }}
          >
            {isPending ? (
              <>
                <span className="connect-spinner" aria-hidden="true" />
                Abriendo wallet…
              </>
            ) : (
              `Conectar ${friendlyName(c.name)}`
            )}
          </button>
        ))}
      </div>

      {/* Error amigable — solo si NO fue un rechazo intencional */}
      {friendlyError && (
        <div className="connect-error-msg" role="alert">
          {friendlyError}
        </div>
      )}
    </div>
  );
}
