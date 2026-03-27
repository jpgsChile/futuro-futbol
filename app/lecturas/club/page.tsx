"use client";

import { useState } from "react";
import { useReadContract } from "wagmi";
import { CONTRACTS } from "@/lib/contracts";
import DetailList from "@/components/DetailList";
import { FFViewsAbi } from "@/abi/FFViews";
import EntityHeader from "@/components/entity/EntityHeader";
import EntityCard from "@/components/entity/EntityCard";
import EntityButton from "@/components/entity/EntityButton";

export default function Page() {
  const [id, setId] = useState("");
  const { data, refetch, isFetching } = useReadContract({
    address: CONTRACTS.FFViews as `0x${string}`,
    abi: FFViewsAbi,
    functionName: "getClub",
    args: id ? [BigInt(id)] : undefined,
  });
  const club = data as any;

  return (
    <main className="space-y-4 content-narrow">
      <EntityHeader icon="⚽" label="Registro on-chain" title="Club" pill="Club" />

      <EntityCard compact>
        <p style={{ margin: "0 0 var(--space-3) 0", fontSize: 13, color: "var(--color-text-muted)" }}>
          Consulta los datos de un club desde el contrato <code>FFViews</code>.
        </p>
        <div className="row">
          <input className="input" type="number" min="1" placeholder="ID Club (ej: 1)" value={id} onChange={(e) => setId(e.target.value)} style={{ maxWidth: 220 }} />
          <EntityButton onClick={() => refetch()} disabled={!id || isFetching}>
            {isFetching ? "Buscando…" : "Buscar club"}
          </EntityButton>
        </div>
      </EntityCard>

      {isFetching && (
        <EntityCard style={{ textAlign: "center", padding: "var(--space-8)" }}>
          <div style={{ fontSize: 28, marginBottom: "var(--space-3)" }}>⚽</div>
          <p style={{ margin: 0, fontSize: 14, color: "var(--color-text-muted)" }}>Consultando contrato…</p>
        </EntityCard>
      )}

      {!isFetching && club && (
        <EntityCard accent>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "var(--space-4)", paddingBottom: "var(--space-4)", borderBottom: "1px solid var(--color-border)" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--entity-accent-text)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
                Club #{String(club.id ?? id)}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--color-text)" }}>{String(club.name || "—")}</div>
              <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 2 }}>Liga #{String(club.leagueId ?? "—")}</div>
            </div>
            <span style={{ padding: "4px 12px", borderRadius: "var(--radius-full)", background: "var(--entity-accent-light)", border: "1px solid var(--entity-accent-border)", color: "var(--entity-accent-text)", fontSize: 12, fontWeight: 600 }}>
              {club.fixedGoalkeeper ? "Portero fijo" : "Sin portero fijo"}
            </span>
          </div>
          <DetailList items={[
            { label: "ID", value: club.id },
            { label: "Liga ID", value: club.leagueId },
            { label: "Nombre", value: club.name },
            { label: "Portero Fijo", value: club.fixedGoalkeeper },
            { label: "Propietario", value: club.owner },
          ]} />
        </EntityCard>
      )}

      {!isFetching && !club && id && (
        <EntityCard style={{ textAlign: "center", padding: "var(--space-8)" }}>
          <p style={{ margin: 0, fontSize: 14, color: "var(--color-text-muted)" }}>No se encontró el club con ID <strong>{id}</strong>.</p>
        </EntityCard>
      )}

      {!isFetching && !club && !id && (
        <EntityCard style={{ textAlign: "center", padding: "var(--space-10)", borderStyle: "dashed", borderColor: "var(--color-border-2)", background: "transparent" }}>
          <div style={{ fontSize: 32, marginBottom: "var(--space-3)" }}>⚽</div>
          <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: 14 }}>Ingresa un ID y presiona <strong>Buscar club</strong>.</p>
        </EntityCard>
      )}
    </main>
  );
}
