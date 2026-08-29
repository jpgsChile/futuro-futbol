"use client";

import { useMemo, useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { FFPlayerAbi } from "@/abi/FFPlayer";
import { CONTRACTS } from "@/lib/contracts";
import EntityHeader from "@/components/entity/EntityHeader";
import EntityCard from "@/components/entity/EntityCard";
import EntityButton from "@/components/entity/EntityButton";

const POSITIONS = [
  "Portero", "Lateral derecho", "Defensa central", "Lateral izquierdo",
  "Carrilero derecho", "Carrilero izquierdo", "Pivote / Mediocentro defensivo",
  "Mediocentro", "Mediapunta", "Extremo derecho", "Extremo izquierdo",
  "Delantero centro", "Segundo delantero",
];

export default function Page() {
  const { isConnected } = useAccount();
  const pos = useMemo(() => POSITIONS, []);

  const [nickname, setNickname] = useState("");
  const [fullName, setFullName] = useState("");
  const [primaryPosition, setPrimaryPosition] = useState("0");
  const [secondaryPosition, setSecondaryPosition] = useState("");
  const [tertiaryPosition, setTertiaryPosition] = useState("");
  const [level, setLevel] = useState("5");
  const [isMinor, setIsMinor] = useState(false);
  const [guardian, setGuardian] = useState<`0x${string}` | "">("");
  const [visibility, setVisibility] = useState("0");

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  return (
    <main className="content-narrow" style={{ display: "grid", gap: "var(--space-4)" }}>
      <EntityHeader icon="👤" label="Perfil de Jugador" title="Registrar jugador" pill="Jugador" />

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
            functionName: "registerPlayerFF",
            args: [
              fullName, nickname,
              Number(primaryPosition),
              Number(secondaryPosition || "0"),
              Number(tertiaryPosition || "0"),
              Number(level),
              isMinor,
              (guardian || "0x0000000000000000000000000000000000000000") as `0x${string}`,
              Number(visibility),
            ],
          });
        }}
        style={{ display: "grid", gap: "var(--space-4)" }}
      >
        <EntityCard accent sectionTitle="Identidad personal">
          <div style={{ display: "grid", gap: "var(--space-4)" }}>
            <div>
              <label className="block text-sm font-medium">Nombre completo</label>
              <input className="input" placeholder="Nombre y Apellido" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium">Apodo <span style={{ color: "var(--color-text-dim)", fontWeight: 400 }}>(opcional)</span></label>
              <input className="input" placeholder="Como te conocen en la cancha" value={nickname} onChange={(e) => setNickname(e.target.value)} />
            </div>
          </div>
        </EntityCard>

        <EntityCard accent sectionTitle="Posición en cancha">
          <div style={{ display: "grid", gap: "var(--space-4)" }}>
            <div>
              <label className="block text-sm font-medium">Posición principal</label>
              <select className="select" value={primaryPosition} onChange={(e) => setPrimaryPosition(e.target.value)}>
                {pos.map((p, i) => <option key={p} value={String(i)}>{p}</option>)}
              </select>
            </div>
            <div className="form-row">
              <div>
                <label className="block text-sm font-medium">Secundaria <span style={{ color: "var(--color-text-dim)", fontWeight: 400 }}>(opc.)</span></label>
                <select className="select" value={secondaryPosition} onChange={(e) => setSecondaryPosition(e.target.value)}>
                  <option value="">(ninguna)</option>
                  {pos.map((p, i) => <option key={p} value={String(i)}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Terciaria <span style={{ color: "var(--color-text-dim)", fontWeight: 400 }}>(opc.)</span></label>
                <select className="select" value={tertiaryPosition} onChange={(e) => setTertiaryPosition(e.target.value)}>
                  <option value="">(ninguna)</option>
                  {pos.map((p, i) => <option key={p} value={String(i)}>{p}</option>)}
                </select>
              </div>
            </div>
          </div>
        </EntityCard>

        <EntityCard accent sectionTitle="Perfil competitivo">
          <div style={{ display: "grid", gap: "var(--space-4)" }}>
            <div className="form-row">
              <div>
                <label className="block text-sm font-medium">Nivel (1–10)</label>
                <input className="input" type="number" min="1" max="10" value={level} onChange={(e) => setLevel(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium">Visibilidad</label>
                <select className="select" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                  <option value="0">Público</option>
                  <option value="1">Restringido</option>
                </select>
              </div>
            </div>
            <div
              className="row"
              style={{ padding: "var(--space-3) var(--space-4)", background: isMinor ? "var(--color-warn-bg)" : "var(--color-surface-2)", borderRadius: "var(--radius-md)", border: `1px solid ${isMinor ? "var(--color-warn-border)" : "var(--color-border)"}`, cursor: "pointer", transition: "background 0.18s ease, border-color 0.18s ease" }}
              onClick={() => setIsMinor(!isMinor)}
            >
              <input id="minor" type="checkbox" checked={isMinor} onChange={(e) => setIsMinor(e.target.checked)} style={{ flexShrink: 0 }} />
              <div>
                <label htmlFor="minor" style={{ fontSize: 14, fontWeight: 600, cursor: "pointer", display: "block", color: isMinor ? "var(--color-warn-text)" : "var(--color-text)" }}>
                  Es menor de edad
                </label>
                <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>Se requerirá la dirección del tutor legal.</span>
              </div>
            </div>
            {isMinor && (
              <div>
                <label className="block text-sm font-medium">Dirección del tutor legal</label>
                <input className="input" placeholder="0x..." value={guardian} onChange={(e) => setGuardian(e.target.value as `0x${string}`)} />
              </div>
            )}
          </div>
        </EntityCard>

        <EntityCard compact>
          <div className="form-actions">
            <EntityButton type="submit" disabled={isPending || isLoading || !isConnected}>
              {isPending ? "⏳ Firmando…" : isLoading ? "📡 Enviando…" : isSuccess ? "✓ Jugador registrado" : "Registrar jugador on-chain"}
            </EntityButton>
            {hash && <a className="btn-secondary" href={`https://testnet.snowtrace.io/tx/${hash}`} target="_blank" rel="noreferrer">Ver tx ↗</a>}
          </div>
          {isSuccess && <FeedbackOk>✓ Jugador registrado correctamente on-chain.</FeedbackOk>}
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
