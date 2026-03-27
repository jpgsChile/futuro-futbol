import dynamic from "next/dynamic";
import QuickChecks from "@/components/QuickChecks";

const ProfileSelector = dynamic(
  () => import("@/components/ProfileSelector"),
  { ssr: false }
);

/**
 * HomePage — Diseño en dos zonas con jerarquía visual clara.
 *
 * ZONA 1 — Presentación (home-intro):
 *   Grid 60/40: hero con copy y features (izq) + estado de wallet (der)
 *   Ambas columnas tienen contenido de peso equivalente.
 *   Un separador visual marca el cambio de zona.
 *
 * ZONA 2 — Acción (home-action):
 *   El selector de rol ocupa el ancho completo.
 *   Es la única acción visible → máxima claridad de flujo.
 *   Sin card wrapper exterior: el selector tiene su propio espacio.
 */
export default function HomePage() {
  return (
    <main className="home-page">

      {/* ── ZONA 1: Presentación ──────────────────────────── */}
      <section className="home-intro">

        {/* Columna izquierda: identidad + propuesta de valor */}
        <div className="home-intro-left">
          <span className="home-eyebrow">⚽ Gestión deportiva on-chain</span>

          <h1 className="home-headline">LigaX</h1>

          <p className="home-subline">
            Ligas, clubes, jugadores y partidos con trazabilidad
            completa y roles verificables en tiempo real.
          </p>

          <ul className="home-features">
            <li className="home-feature">
              <span className="home-feature-icon">🔐</span>
              <div>
                <strong>Roles verificables</strong>
                <span>Permisos on-chain por tipo de entidad</span>
              </div>
            </li>
            <li className="home-feature">
              <span className="home-feature-icon">📁</span>
              <div>
                <strong>Evidencia inmutable</strong>
                <span>Metadata descentralizada para eventos</span>
              </div>
            </li>
            <li className="home-feature">
              <span className="home-feature-icon">🔍</span>
              <div>
                <strong>Transparencia total</strong>
                <span>Historial de alineaciones y resultados</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Columna derecha: estado de la wallet */}
        <div className="home-intro-right">
          <QuickChecks />
        </div>

      </section>

      {/* ── Divisor de zona ───────────────────────────────── */}
      <div className="home-divider">
        <span className="home-divider-label">¿Cuál es tu rol?</span>
      </div>

      {/* ── ZONA 2: Acción — selector de perfil ───────────── */}
      <section className="home-action">
        <ProfileSelector />
      </section>

    </main>
  );
}
