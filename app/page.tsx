import dynamic from "next/dynamic";
import QuickChecks from "@/components/QuickChecks";
import HeroCarousel from "@/components/HeroCarousel";

const ProfileSelector = dynamic(
  () => import("@/components/ProfileSelector"),
  { ssr: false }
);

const HERO_NOTES = [
  {
    id: "identity",
    index: "01",
    title: "Identidad verificable",
    body: "Ligas, clubes y jugadores operan sobre permisos trazables y faciles de auditar.",
  },
  {
    id: "evidence",
    index: "02",
    title: "Evidencia con sello real",
    body: "Cada partido, evento y attestation queda listo para consulta y prueba operativa.",
  },
  {
    id: "rhythm",
    index: "03",
    title: "Ritmo de jornada",
    body: "Una misma capa conecta alta de entidades, lectura de estado y ejecucion matchday.",
  },
];

const HERO_SIGNALS = [
  {
    id: "consensus",
    label: "Consensus",
    value: "Avalanche finality",
    copy: "Confirmacion visible para flujos que no admiten ambiguedad.",
  },
  {
    id: "permissions",
    label: "Permissions",
    value: "Roles firmados",
    copy: "Superficies claras para liga, club, jugador y operaciones de partido.",
  },
  {
    id: "evidence",
    label: "Evidence",
    value: "IPFS + attestations",
    copy: "Pruebas listas para lectura, validacion y continuidad operativa.",
  },
  {
    id: "ops",
    label: "Operations",
    value: "Matchday ready",
    copy: "De la wallet a la accion critica sin cambiar de contexto visual.",
  },
];

const STATUS_STEPS = [
  {
    id: "wallet",
    index: "01",
    title: "Valida la wallet antes de operar",
    body: "El estado de conexion y el rol activo quedan visibles en una sola pieza de control.",
  },
  {
    id: "role",
    index: "02",
    title: "Detecta permisos al instante",
    body: "La lectura on-chain elimina dudas sobre quien puede ejecutar una accion critica.",
  },
  {
    id: "flows",
    index: "03",
    title: "Activa el flujo correcto",
    body: "Liga, club y jugador aterrizan en recorridos distintos sin ruido ni pasos sobrantes.",
  },
];

export default function HomePage() {
  return (
    <main className="home-page">
      <section className="home-hero" aria-labelledby="home-hero-title">
        <div className="home-hero-grid">
          <div className="home-hero-copy">
            <div className="home-kicker-row">
              <span className="home-eyebrow">Web3 matchday infrastructure</span>
              <span className="home-hero-proof">
                Avalanche / IPFS / roles signed
              </span>
            </div>

            <h1
              className="home-headline home-headline-display"
              id="home-hero-title"
            >
              Operacion premium para
              <span className="home-headline-accent"> futbol on-chain</span>
            </h1>

            <p className="home-subline">
              LigaX convierte ligas, clubes, jugadores y partidos en una capa
              operativa verificable. Wallet, permisos, evidencia y estado de
              jornada conviven en una experiencia con escala, control y
              credibilidad real.
            </p>

            <div className="home-hero-actions">
              <a className="home-cta home-cta-primary" href="#roles">
                Elegir superficie
              </a>
              <a className="home-cta home-cta-secondary" href="#estado">
                Ver control operativo
              </a>
            </div>

            <div className="home-hero-notes">
              {HERO_NOTES.map((note) => (
                <article className="home-hero-note" key={note.id}>
                  <span className="home-hero-note-index">{note.index}</span>
                  <div className="home-hero-note-copy">
                    <strong>{note.title}</strong>
                    <p>{note.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="home-hero-media">
            <HeroCarousel />
          </div>
        </div>

        <div className="home-hero-band" aria-label="Senales clave de LigaX">
          {HERO_SIGNALS.map((signal) => (
            <article className="home-hero-signal" key={signal.id}>
              <span className="home-hero-signal-label">{signal.label}</span>
              <strong className="home-hero-signal-value">{signal.value}</strong>
              <p className="home-hero-signal-copy">{signal.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="home-status"
        id="estado"
        aria-labelledby="home-status-title"
      >
        <div className="home-status-panel">
          <QuickChecks />
        </div>

        <div className="home-status-info">
          <span className="home-status-eyebrow">Control room</span>
          <h2 className="home-status-title" id="home-status-title">
            Una mesa de control lista para decidir en segundos
          </h2>
          <p className="home-status-subline">
            Conecta la wallet, valida permisos y aterriza las acciones de liga,
            club y partido desde una sola superficie con lectura on-chain
            inmediata.
          </p>

          <div className="home-status-rail">
            {STATUS_STEPS.map((step) => (
              <article className="home-status-item" key={step.id}>
                <span className="home-status-item-icon">{step.index}</span>
                <div className="home-status-item-copy">
                  <strong>{step.title}</strong>
                  <p>{step.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="home-divider">
        <span className="home-divider-label">Rutas operativas</span>
      </div>

      <section className="home-action" id="roles" aria-labelledby="roles-title">
        <div className="home-action-intro">
          <span className="home-action-eyebrow">Entry points</span>
          <h2 className="home-action-title" id="roles-title">
            Elegi la superficie correcta para cada rol
          </h2>
          <p className="home-action-subline">
            Cada flujo abre permisos, lecturas y acciones concretas para liga,
            club o jugador sin ruido visual innecesario.
          </p>
        </div>

        <ProfileSelector />
      </section>
    </main>
  );
}
