"use client";

import { useState } from "react";
import { useReadContract } from "wagmi";
import { CONTRACTS } from "@/lib/contracts";
import DetailList from "@/components/DetailList";
import { FFViewsAbi } from "@/abi/FFViews";
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
  const [id, setId] = useState("");
  const { data, refetch, isFetching } = useReadContract({
    address: CONTRACTS.FFViews as `0x${string}`,
    abi: FFViewsAbi,
    functionName: "getJugador",
    args: id ? [BigInt(id)] : undefined,
  });
  const p = data as any;

  return (
    <main className="content-narrow" style={{ display: "grid", gap: "var(--space-4)" }}>
      <EntityHeader icon="👤" label="Perfil on-chain" title="Jugador" pill="Jugador" />

      <EntityCard compact>
        <p style={{ margin: "0 0 var(--space-3) 0", fontSize: 13, color: "var(--color-text-muted)" }}>
          Consulta la ficha técnica de un jugador desde el contrato <code>FFViews</code>.
        </p>
        <div className="row">
          <input className="input" type="number" min="1" placeholder="ID Jugador (ej: 1)" value={id} onChange={(e) => setId(e.target.value)} style={{ maxWidth: 220 }} />
          <EntityButton onClick={() => refetch()} disabled={!id || isFetching}>
            {isFetching ? "Buscando…" : "Ver perfil"}
          </EntityButton>
        </div>
      </EntityCard>

      {isFetching && (
        <EntityCard style={{ textAlign: "center", padding: "var(--space-8)" }}>
          <div style={{ fontSize: 28, marginBottom: "var(--space-3)" }}>👤</div>
          <p style={{ margin: 0, fontSize: 14, color: "var(--color-text-muted)" }}>Cargando perfil del jugador…</p>
        </EntityCard>
      )}

      {!isFetching && p && (() => {
        const posIndex = Number(p.primaryPosition ?? 0);
        const secIndex = Number(p.secondaryPosition ?? 0);
        const terIndex = Number(p.tertiaryPosition ?? 0);
        return (
          <>
            {/* Identity card */}
            <EntityCard accent style={{ background: "linear-gradient(135deg, var(--color-surface) 0%, var(--entity-surface) 100%)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-4)" }}>
                <div style={{ width: 64, height: 64, borderRadius: "var(--radius-lg)", background: "var(--entity-accent-light)", border: "2px solid var(--entity-accent-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>
                  👤
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--entity-accent-text)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>
                    Jugador #{String(p.id ?? id)}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "var(--color-text)", lineHeight: 1.2 }}>{String(p.fullName || "—")}</div>
                  {p.nickname && <div style={{ fontSize: 13, color: "var(--entity-accent-text)", marginTop: 2, fontStyle: "italic" }}>"{String(p.nickname)}"</div>}
                  <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-3)", flexWrap: "wrap" }}>
                    <span style={{ padding: "3px 10px", borderRadius: "var(--radius-full)", background: "var(--entity-accent-light)", border: "1px solid var(--entity-accent-border)", color: "var(--entity-accent-text)", fontSize: 11, fontWeight: 600 }}>
                      {POSITIONS[posIndex] ?? `Posición ${posIndex}`}
                    </span>
                    {p.level != null && (
                      <span style={{ padding: "3px 10px", borderRadius: "var(--radius-full)", background: "var(--color-surface-2)", border: "1px solid var(--color-border)", color: "var(--color-text-muted)", fontSize: 11, fontWeight: 600 }}>
                        Nivel {String(p.level)}
                      </span>
                    )}
                    {p.isMinor && (
                      <span style={{ padding: "3px 10px", borderRadius: "var(--radius-full)", background: "var(--color-warn-bg)", border: "1px solid var(--color-warn-border)", color: "var(--color-warn-text)", fontSize: 11, fontWeight: 600 }}>
                        Menor de edad
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </EntityCard>

            {/* Ficha técnica */}
            <EntityCard accent sectionTitle="Ficha técnica">
              <DetailList items={[
                { label: "ID", value: p.id },
                { label: "Cuenta", value: p.account },
                { label: "Nombre completo", value: p.fullName },
                { label: "Apodo", value: p.nickname },
                { label: "Posición principal", value: POSITIONS[posIndex] ?? posIndex },
                { label: "Posición secundaria", value: POSITIONS[secIndex] ?? p.secondaryPosition },
                { label: "Posición terciaria", value: POSITIONS[terIndex] ?? p.tertiaryPosition },
                { label: "Nivel", value: p.level },
                { label: "Menor", value: p.isMinor },
                { label: "Tutor", value: p.guardian },
                { label: "Visibilidad", value: Number(p.visibility) === 0 ? "Público" : "Restringido" },
                { label: "Club ID", value: p.clubId },
              ]} />
            </EntityCard>
          </>
        );
      })()}

      {!isFetching && !p && id && (
        <EntityCard style={{ textAlign: "center", padding: "var(--space-8)" }}>
          <p style={{ margin: 0, fontSize: 14, color: "var(--color-text-muted)" }}>No se encontró el jugador con ID <strong>{id}</strong>.</p>
        </EntityCard>
      )}

      {!isFetching && !p && !id && (
        <EntityCard style={{ textAlign: "center", padding: "var(--space-10)", borderStyle: "dashed", borderColor: "var(--color-border-2)", background: "transparent" }}>
          <div style={{ fontSize: 40, marginBottom: "var(--space-3)" }}>👤</div>
          <p style={{ margin: "0 0 var(--space-2) 0", fontWeight: 600 }}>Consulta el perfil de un jugador</p>
          <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: 13 }}>Ingresa un ID y presiona <strong>Ver perfil</strong>.</p>
        </EntityCard>
      )}
    </main>
  );
}
