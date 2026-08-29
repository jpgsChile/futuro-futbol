"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { CONTRACTS } from "@/lib/contracts";
import { FFPlayerAbi } from "@/abi/FFPlayer";
import EntityHeader from "@/components/entity/EntityHeader";
import EntityCard from "@/components/entity/EntityCard";
import EntityButton from "@/components/entity/EntityButton";

export default function Page() {
  const { isConnected } = useAccount();
  const [playerId, setPlayerId] = useState("");
  const [clubId, setClubId] = useState("");
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  return (
    <main className="content-narrow" style={{ display: "grid", gap: "var(--space-4)" }}>
      <EntityHeader icon="⚽" label="Gestión de Club" title="Unir jugador a club" pill="Club" />

      {!isConnected && (
        <EntityCard style={{ borderColor: "var(--color-warn-border)", background: "var(--color-warn-bg)", padding: "var(--space-4)" }}>
          <p style={{ margin: 0, color: "var(--color-warn-text)", fontSize: 14 }}>
            ⚠️ Conecta tu wallet. Requiere rol <code>CLUB_ROLE</code>.
          </p>
        </EntityCard>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          writeContract({
            address: CONTRACTS.FFPlayer as `0x${string}`,
            abi: FFPlayerAbi,
            functionName: "playerJoinClub",
            args: [BigInt(playerId || "0"), BigInt(clubId || "0")],
          });
        }}
        style={{ display: "grid", gap: "var(--space-4)" }}
      >
        <EntityCard accent sectionTitle="Vinculación jugador ↔ club">
          <p style={{ margin: "0 0 var(--space-4) 0", fontSize: 13, color: "var(--color-text-muted)" }}>
            Esta acción registra on-chain que el jugador pasa a pertenecer al club indicado.
          </p>
          <div className="form-row">
            <div>
              <label className="block text-sm font-medium">ID Jugador</label>
              <input className="input" type="number" min="1" placeholder="ej: 1" value={playerId} onChange={(e) => setPlayerId(e.target.value)} />
              <p className="help">El jugador debe existir on-chain.</p>
            </div>
            <div>
              <label className="block text-sm font-medium">ID Club</label>
              <input className="input" type="number" min="1" placeholder="ej: 1" value={clubId} onChange={(e) => setClubId(e.target.value)} />
              <p className="help">El club debe estar en la misma liga.</p>
            </div>
          </div>
        </EntityCard>

        <EntityCard compact>
          <div className="form-actions">
            <EntityButton type="submit" disabled={isPending || isLoading || !isConnected || !playerId || !clubId}>
              {isPending ? "⏳ Firmando…" : isLoading ? "📡 Enviando…" : isSuccess ? "✓ Jugador vinculado" : "Unir jugador al club"}
            </EntityButton>
            {hash && <a className="btn-secondary" href={`https://testnet.snowtrace.io/tx/${hash}`} target="_blank" rel="noreferrer">Ver tx ↗</a>}
          </div>
          {isSuccess && <FeedbackOk>✓ Jugador #{playerId} vinculado al club #{clubId} on-chain.</FeedbackOk>}
          {error && <FeedbackErr>{String(error.message || error)}</FeedbackErr>}
        </EntityCard>
      </form>
    </main>
  );
}

function FeedbackOk({ children }: { children: React.ReactNode }) {
  return <div style={{ marginTop: "var(--space-3)", padding: "var(--space-3) var(--space-4)", borderRadius: "var(--radius-md)", background: "var(--color-success-bg)", border: "1px solid var(--color-success-border)", color: "var(--color-success-text)", fontSize: 13 }}>{children}</div>;
}
function FeedbackErr({ children }: { children: React.ReactNode }) {
  return <div style={{ marginTop: "var(--space-3)", padding: "var(--space-3) var(--space-4)", borderRadius: "var(--radius-md)", background: "#1a0808", border: "1px solid #4d1a1a", color: "var(--color-error)", fontSize: 12, wordBreak: "break-all" }}>{children}</div>;
}
