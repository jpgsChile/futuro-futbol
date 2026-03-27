"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useEffect, useState } from "react";

/**
 * Connect — Conexión de wallet con UX completa de desconexión.
 *
 * Estados:
 * 1. SSR / pre-mount   → botón placeholder deshabilitado (anti-hydration)
 * 2. Sin provider      → mensaje amigable + botones deshabilitados
 * 3. Sin conectar      → botones de conector disponibles
 * 4. Conectado         → card de estado con dirección + botones Desconectar / Cambiar
 *
 * La lógica wagmi (useConnect, useDisconnect, useAccount) no se modificó.
 * disconnect() de wagmi limpia el estado local; la wallet en el navegador
 * sigue disponible pero la app ya no la considera conectada.
 */
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

  // Pre-mount: placeholder estático anti-SSR
  if (!mounted) {
    return (
      <button className="button" disabled>
        Conectar wallet
      </button>
    );
  }

  // ── Estado: CONECTADO ────────────────────────────────────
  if (isConnected && address) {
    return (
      <div className="wallet-connected-card">
        {/* Indicador de estado */}
        <div className="wallet-connected-status">
          <span className="wallet-dot" />
          <span className="wallet-connected-label">Wallet conectada</span>
        </div>

        {/* Dirección */}
        <div className="wallet-address" title={address}>
          {address.slice(0, 8)}…{address.slice(-6)}
        </div>

        {/* Acciones */}
        <div className="wallet-actions">
          <button
            className="btn-wallet-disconnect"
            onClick={() => disconnect()}
            title="Desconectar wallet de esta app"
          >
            Desconectar
          </button>
          {/* Cambiar wallet: reconectar con otro conector */}
          {connectors.length > 1 && (
            <button
              className="btn-secondary"
              onClick={() => {
                disconnect();
                // Pequeño delay para que wagmi limpie el estado antes de reconectar
                setTimeout(() => connect({ connector: connectors[0] }), 150);
              }}
              title="Desconectar y elegir otra wallet"
            >
              Cambiar
            </button>
          )}
        </div>

        {/* Nota informativa */}
        <p className="wallet-connected-note">
          Para cambiar de cuenta, usá el selector de tu wallet directamente.
        </p>
      </div>
    );
  }

  // Filtra error técnico crudo de wagmi
  const isProviderError =
    error &&
    (String(error.message || error).includes("Provider not found") ||
      String(error.message || error).toLowerCase().includes("provider"));

  const friendlyError = error && !isProviderError
    ? String(error.message || error)
    : null;

  // ── Estado: SIN PROVIDER ─────────────────────────────────
  if (hasProvider === false) {
    return (
      <div style={{ display: "grid", gap: "var(--space-3)" }}>
        <div className="wallet-hint">
          <span className="wallet-hint-title">
            No se detectó una wallet compatible en este navegador.
          </span>
          <span>
            Instalá MetaMask, Core Wallet u otra billetera EVM para continuar.
          </span>
        </div>
        {connectors.map((c) => (
          <button key={c.uid} className="btn" disabled title={c.name}>
            Conectar {c.name}
          </button>
        ))}
      </div>
    );
  }

  // ── Estado: CON PROVIDER, SIN CONECTAR ──────────────────
  return (
    <div style={{ display: "grid", gap: "var(--space-2)" }}>
      <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
        {connectors.map((c) => (
          <button
            key={c.uid}
            className="button"
            onClick={() => connect({ connector: c })}
            disabled={isPending}
            title={c.name}
          >
            {isPending ? "Conectando…" : `Conectar ${c.name}`}
          </button>
        ))}
      </div>
      {friendlyError && (
        <span style={{ color: "var(--color-error)", fontSize: 12 }}>
          {friendlyError}
        </span>
      )}
    </div>
  );
}
