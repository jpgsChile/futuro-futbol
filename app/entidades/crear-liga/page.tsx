"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { FFLeagueAbi } from "@/abi/FFLeague";
import { CONTRACTS } from "@/lib/contracts";
import EntityHeader from "@/components/entity/EntityHeader";
import EntityCard from "@/components/entity/EntityCard";
import EntityButton from "@/components/entity/EntityButton";

const CATEGORIAS = [
  "Junior", "Honor", "Serie", "Super Senior",
  "Juvenil", "Infantil", "Universitaria",
  "Dorado", "Platino", "Viejos Crack",
];

export default function CrearLigaPage() {
  const { isConnected } = useAccount();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  const validate = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Nombre requerido (mínimo 2 caracteres)";
    if (location.trim().length < 2) e.location = "Ubicación requerida";
    if (!category) e.category = "Selecciona una categoría";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    writeContract({
      address: CONTRACTS.FFLeague as `0x${string}`,
      abi: FFLeagueAbi,
      functionName: "createLeague",
      args: [name.trim(), location.trim(), category],
    });
  };

  return (
    <main className="content-narrow" style={{ display: "grid", gap: "var(--space-4)" }}>
      <EntityHeader icon="🏆" label="Gestión de Liga" title="Crear nueva liga" pill="Liga" />

      {!isConnected && (
        <EntityCard style={{ borderColor: "var(--color-warn-border)", background: "var(--color-warn-bg)", padding: "var(--space-4)" }}>
          <p style={{ margin: 0, color: "var(--color-warn-text)", fontSize: 14 }}>
            ⚠️ Conecta tu wallet para crear una liga. Requiere rol <code>LEAGUE_ROLE</code>.
          </p>
        </EntityCard>
      )}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "var(--space-4)" }}>
        <EntityCard accent sectionTitle="Identidad de la liga">
          <div style={{ display: "grid", gap: "var(--space-4)" }}>
            <div>
              <label className="block text-sm font-medium">Nombre de la liga</label>
              <input
                className="input"
                placeholder="ej: Liga ADBChile"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Ubicación</label>
              <input
                className="input"
                placeholder="ej: San Bernardo, Chile"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              {errors.location && <p className="text-red-500 text-xs">{errors.location}</p>}
            </div>
          </div>
        </EntityCard>

        <EntityCard accent sectionTitle="Categoría">
          <div>
            <label className="block text-sm font-medium">Categoría de competición</label>
            <select
              className="select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" disabled>Selecciona una categoría</option>
              {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}
          </div>
        </EntityCard>

        <EntityCard compact>
          <div className="form-actions">
            <EntityButton type="submit" disabled={isPending || isLoading || !isConnected}>
              {isPending ? "⏳ Firmando…" : isLoading ? "📡 Enviando…" : isSuccess ? "✓ Liga creada" : "Crear liga on-chain"}
            </EntityButton>
            {hash && (
              <a className="btn-secondary" href={`https://testnet.snowtrace.io/tx/${hash}`} target="_blank" rel="noreferrer">
                Ver tx ↗
              </a>
            )}
          </div>
          {isSuccess && (
            <div style={{ marginTop: "var(--space-3)", padding: "var(--space-3) var(--space-4)", borderRadius: "var(--radius-md)", background: "var(--color-success-bg)", border: "1px solid var(--color-success-border)", color: "var(--color-success-text)", fontSize: 13 }}>
              ✓ Liga registrada correctamente on-chain.
            </div>
          )}
          {error && (
            <div style={{ marginTop: "var(--space-3)", padding: "var(--space-3) var(--space-4)", borderRadius: "var(--radius-md)", background: "#1a0808", border: "1px solid #4d1a1a", color: "var(--color-error)", fontSize: 12, wordBreak: "break-all" }}>
              {String(error.message || error)}
            </div>
          )}
        </EntityCard>
      </form>
    </main>
  );
}
