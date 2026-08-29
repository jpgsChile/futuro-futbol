"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { FFClubAbi } from "@/abi/FFClub";
import { CONTRACTS } from "@/lib/contracts";
import EntityHeader from "@/components/entity/EntityHeader";
import EntityCard from "@/components/entity/EntityCard";
import EntityButton from "@/components/entity/EntityButton";

export default function Page() {
  const { isConnected } = useAccount();
  const [leagueId, setLeagueId] = useState("");
  const [name, setName] = useState("");
  const [fixedGK, setFixedGK] = useState(false);
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  return (
    <main className="content-narrow" style={{ display: "grid", gap: "var(--space-4)" }}>
      <EntityHeader icon="⚽" label="Gestión de Club" title="Crear nuevo club" pill="Club" />

      {!isConnected && (
        <EntityCard style={{ borderColor: "var(--color-warn-border)", background: "var(--color-warn-bg)", padding: "var(--space-4)" }}>
          <p style={{ margin: 0, color: "var(--color-warn-text)", fontSize: 14 }}>
            ⚠️ Conecta tu wallet para crear un club. Requiere rol <code>LEAGUE_ROLE</code>.
          </p>
        </EntityCard>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          writeContract({
            address: CONTRACTS.FFClub as `0x${string}`,
            abi: FFClubAbi,
            functionName: "createClub",
            args: [BigInt(leagueId || "0"), name, fixedGK],
          });
        }}
        style={{ display: "grid", gap: "var(--space-4)" }}
      >
        <EntityCard accent sectionTitle="Liga de pertenencia">
          <div>
            <label className="block text-sm font-medium">ID Liga</label>
            <input className="input" type="number" min="1" placeholder="ej: 1" value={leagueId} onChange={(e) => setLeagueId(e.target.value)} />
            <p className="help">El club quedará vinculado a esta liga on-chain.</p>
          </div>
        </EntityCard>

        <EntityCard accent sectionTitle="Identidad del equipo">
          <div style={{ display: "grid", gap: "var(--space-4)" }}>
            <div>
              <label className="block text-sm font-medium">Nombre del club</label>
              <input className="input" placeholder="ej: Club Deportivo Unión" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div
              className="row"
              style={{ padding: "var(--space-3) var(--space-4)", background: "var(--color-surface-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", cursor: "pointer" }}
              onClick={() => setFixedGK(!fixedGK)}
            >
              <input id="gk" type="checkbox" checked={fixedGK} onChange={(e) => setFixedGK(e.target.checked)} style={{ flexShrink: 0 }} />
              <div>
                <label htmlFor="gk" style={{ fontSize: 14, fontWeight: 600, cursor: "pointer", display: "block" }}>Portero fijo</label>
                <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>El club tiene un portero asignado permanentemente.</span>
              </div>
            </div>
          </div>
        </EntityCard>

        <EntityCard compact>
          <div className="form-actions">
            <EntityButton type="submit" disabled={isPending || isLoading || !isConnected}>
              {isPending ? "⏳ Firmando…" : isLoading ? "📡 Enviando…" : isSuccess ? "✓ Club creado" : "Crear club on-chain"}
            </EntityButton>
            {hash && (
              <a className="btn-secondary" href={`https://testnet.snowtrace.io/tx/${hash}`} target="_blank" rel="noreferrer">Ver tx ↗</a>
            )}
          </div>
          {isSuccess && <FeedbackOk>✓ Club registrado correctamente on-chain en la liga #{leagueId}.</FeedbackOk>}
          {error && <FeedbackErr>{String(error.message || error)}</FeedbackErr>}
        </EntityCard>
      </form>
    </main>
  );
}

function FeedbackOk({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginTop: "var(--space-3)", padding: "var(--space-3) var(--space-4)", borderRadius: "var(--radius-md)", background: "var(--color-success-bg)", border: "1px solid var(--color-success-border)", color: "var(--color-success-text)", fontSize: 13 }}>
      {children}
    </div>
  );
}
function FeedbackErr({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginTop: "var(--space-3)", padding: "var(--space-3) var(--space-4)", borderRadius: "var(--radius-md)", background: "#1a0808", border: "1px solid #4d1a1a", color: "var(--color-error)", fontSize: 12, wordBreak: "break-all" }}>
      {children}
    </div>
  );
}
