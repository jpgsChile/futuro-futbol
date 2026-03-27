"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { FFLeagueAbi } from "@/abi/FFLeague";
import { CONTRACTS } from "@/lib/contracts";
import EntityHeader from "@/components/entity/EntityHeader";
import EntityCard from "@/components/entity/EntityCard";
import EntityButton from "@/components/entity/EntityButton";

const schema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  location: z.string().min(2, "Ubicación requerida"),
  category: z.string().min(1, "Categoría requerida"),
});
type FormValues = z.infer<typeof schema>;

const CATEGORIAS = [
  "Junior", "Honor", "Serie", "Super Senior",
  "Juvenil", "Infantil", "Universitaria",
  "Dorado", "Platino", "Viejos Crack",
];

export default function CrearLigaPage() {
  const { isConnected } = useAccount();
  const { register, handleSubmit, reset, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  const onSubmit = (v: FormValues) => {
    writeContract({
      address: CONTRACTS.FFLeague as `0x${string}`,
      abi: FFLeagueAbi,
      functionName: "createLeague",
      args: [v.name, v.location, v.category],
    });
    reset();
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

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: "var(--space-4)" }}>
        <EntityCard accent sectionTitle="Identidad de la liga">
          <div style={{ display: "grid", gap: "var(--space-4)" }}>
            <div>
              <label className="block text-sm font-medium">Nombre de la liga</label>
              <input className="input" placeholder="ej: Liga ADBChile" {...register("name")} />
              {formState.errors.name && <p className="text-red-500 text-xs">{formState.errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Ubicación</label>
              <input className="input" placeholder="ej: San Bernardo, Chile" {...register("location")} />
              {formState.errors.location && <p className="text-red-500 text-xs">{formState.errors.location.message}</p>}
            </div>
          </div>
        </EntityCard>

        <EntityCard accent sectionTitle="Categoría">
          <div>
            <label className="block text-sm font-medium">Categoría de competición</label>
            <select className="select" defaultValue="" {...register("category")}>
              <option value="" disabled>Selecciona una categoría</option>
              {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {formState.errors.category && <p className="text-red-500 text-xs">{formState.errors.category.message}</p>}
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
          {isSuccess && <FeedbackOk>✓ Liga registrada correctamente on-chain.</FeedbackOk>}
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
