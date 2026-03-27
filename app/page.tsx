import dynamic from "next/dynamic";
import QuickChecks from "@/components/QuickChecks";

const ProfileSelector = dynamic(
  () => import("@/components/ProfileSelector"),
  { ssr: false }
);

/**
 * HomePage — Landing de producto LigaX.
 *
 * FILA 1  (home-intro  — grid 60/40):
 *   izq → hero copy + lista de capacidades
 *   der → WalletPanel (estado + conectar/desconectar)
 *
 * FILA 2  (home-action — full width):
 *   selector de rol sin wrappers redundantes
 *
 * Flujo UX:
 *   1. Entender el producto   (hero izq)
 *   2. Ver estado de conexión (panel der)
 *   3. Elegir rol             (FILA 2)
 *   4. Conectar wallet        (inline en selector)
 *   5. Continuar              (CTA en selector)
 */
export default function HomePage() {
  return (
    <main className="home-page">

      {/* ── FILA 1: Hero + Panel de wallet ─────────────── */}
      <section className="home-intro">

        {/* Columna izquierda — propuesta de valor */}
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

        {/* Columna derecha — WalletPanel (estado + connect/disconnect) */}
        <div className="home-intro-right">
          <QuickChecks />
        </div>

      </section>

      {/* ── Divisor de sección ──────────────────────────── */}
      <div className="home-divider">
        <span className="home-divider-label">¿Cuál es tu rol?</span>
      </div>

      {/* ── FILA 2: Selector de perfil (full width) ─────── */}
      <section className="home-action">
        <ProfileSelector />
      </section>

    </main>
  );
}
