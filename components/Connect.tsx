"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useEffect, useState } from "react";

/**
 * Connect — Botón de conexión de wallet.
 * Se eliminó el <ConnectButton> de RainbowKit que aparecía junto a los botones
 * individuales de conector, causando opciones duplicadas en la misma UI.
 * La lógica wagmi (useConnect, useDisconnect, useAccount) es la misma.
 */
export default function Connect() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { isConnected, address } = useAccount();
  const { connectors, connect, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();

  // Sin montar: placeholder estático para evitar hydration mismatch SSR
  if (!mounted) {
    return (
      <button className="button" disabled>
        Conectar wallet
      </button>
    );
  }

  // Conectado: mostrar botón de desconexión con dirección truncada
  if (isConnected) {
    return (
      <button className="btn-secondary" onClick={() => disconnect()}>
        {address?.slice(0, 6)}…{address?.slice(-4)} · Desconectar
      </button>
    );
  }

  // Sin conectar: un botón por conector disponible
  return (
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
      {error ? (
        <span style={{ color: "var(--color-error)", fontSize: 12 }}>
          {String(error.message || error)}
        </span>
      ) : null}
    </div>
  );
}
