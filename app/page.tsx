import dynamic from "next/dynamic";
import QuickChecks from "@/components/QuickChecks";
import HeroCarousel from "@/components/HeroCarousel";

const ProfileSelector = dynamic(
  () => import("@/components/ProfileSelector"),
  { ssr: false }
);

export default function HomePage() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero-copy">
          <span className="home-eyebrow">Futbol on-chain para operaciones reales</span>

          <h1 className="home-headline home-headline-display">LigaX</h1>

          <p className="home-subline">
            La capa de verdad para ligas, clubes, jugadores y partidos.
            Trazabilidad completa, roles seguros y evidencia en tiempo real.
          </p>

          <div className="home-hero-actions">
            <a className="button" href="#roles">Explorar roles</a>
            <a className="btn" href="#estado">Ver estado</a>
          </div>

          <div className="home-hero-metrics">
            <div className="home-metric">
              <span className="home-metric-value">24/7</span>
              <span className="home-metric-label">Trazabilidad activa</span>
            </div>
            <div className="home-metric">
              <span className="home-metric-value">100%</span>
              <span className="home-metric-label">Permisos verificados</span>
            </div>
            <div className="home-metric">
              <span className="home-metric-value">0</span>
              <span className="home-metric-label">Dudas en datos</span>
            </div>
          </div>

          <ul className="home-hero-points">
            <li className="home-hero-point">
              <strong>Roles verificables</strong>
              <span>Permisos por entidad con identidad trazable</span>
            </li>
            <li className="home-hero-point">
              <strong>Evidencia inmutable</strong>
              <span>Partidos y eventos con metadata segura</span>
            </li>
            <li className="home-hero-point">
              <strong>Operacion sincronizada</strong>
              <span>Todo tu ecosistema en tiempo real</span>
            </li>
          </ul>
        </div>

        <div className="home-hero-media">
          <HeroCarousel />
        </div>
      </section>

      <section className="home-status" id="estado">
        <div className="home-status-panel">
          <QuickChecks />
        </div>

        <div className="home-status-info">
          <span className="home-status-eyebrow">Control operativo</span>
          <h2 className="home-status-title">Listo para el dia de partido</h2>
          <p className="home-status-subline">
            Valida permisos, conecta la wallet y ejecuta acciones sin friccion
            desde un panel unico.
          </p>

          <ul className="home-status-list">
            <li className="home-status-item">
              <span className="home-status-item-icon">01</span>
              <div>
                <strong>Validacion rapida</strong>
                <span>Checks on-chain claros y sin ruido</span>
              </div>
            </li>
            <li className="home-status-item">
              <span className="home-status-item-icon">02</span>
              <div>
                <strong>Acceso seguro</strong>
                <span>Roles activos antes de operar</span>
              </div>
            </li>
            <li className="home-status-item">
              <span className="home-status-item-icon">03</span>
              <div>
                <strong>Ejecucion fluida</strong>
                <span>Acciones criticas listas en un flujo</span>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <div className="home-divider">
        <span className="home-divider-label">Selecciona tu rol</span>
      </div>

      <section className="home-action" id="roles">
        <ProfileSelector />
      </section>
    </main>
  );
}
