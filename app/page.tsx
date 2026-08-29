import dynamic from "next/dynamic";
import QuickChecks from "@/components/QuickChecks";
import HeroCarousel from "@/components/HeroCarousel";
import HeroCanvas from "@/components/HeroCanvas";
import HUDBar from "@/components/HUDBar";
import GlowButton from "@/components/GlowButton";

const ProfileSelector = dynamic(
  () => import("@/components/ProfileSelector"),
  {
    ssr: false,
    loading: () => (
      <div className="profile-grid" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div key={i} className="profile-card profile-card-skeleton" />
        ))}
      </div>
    ),
  }
);

const HERO_NOTES = [
  {
    id: "ligas",
    index: "01",
    title: "Organiza tu liga",
    body: "Crea torneos, gestiona calendarios y lleva el control de tu competencia desde un solo lugar.",
  },
  {
    id: "clubes",
    index: "02",
    title: "Gestiona tu club",
    body: "Registra plantillas, administra jugadores y sigue el rendimiento de cada equipo en tiempo real.",
  },
  {
    id: "jornadas",
    index: "03",
    title: "Vive la jornada",
    body: "Registra resultados y estadísticas al instante. Cada partido, cada gol, siempre disponible.",
  },
];

const HERO_SIGNALS = [
  {
    id: "ligas",
    label: "Torneos y ligas",
    value: "Sin límites",
    copy: "Desde torneos locales de barrio hasta ligas profesionales con cientos de equipos.",
  },
  {
    id: "acceso",
    label: "Disponibilidad",
    value: "24 / 7",
    copy: "Accede, registra y consulta resultados en cualquier momento desde cualquier dispositivo.",
  },
  {
    id: "jugadores",
    label: "Jugadores",
    value: "Perfil único",
    copy: "Historial completo de partidos, goles, tarjetas y participación por jugador.",
  },
  {
    id: "control",
    label: "Todo en uno",
    value: "Una sola app",
    copy: "Liga, club, jugador y partido unificados. Sin saltar entre apps ni perder datos.",
  },
];

const STATUS_STEPS = [
  {
    id: "registro",
    index: "01",
    title: "Elige tu rol",
    body: "¿Organizas una liga, administras un club o eres jugador? Cada rol tiene su propio espacio con herramientas pensadas para vos.",
  },
  {
    id: "configura",
    index: "02",
    title: "Configura en minutos",
    body: "Crea tu liga o club, invita equipos, registra jugadores y arma el calendario de partidos sin complicaciones.",
  },
  {
    id: "juega",
    index: "03",
    title: "Vive cada jornada",
    body: "Registra resultados en tiempo real, consulta estadísticas al instante y mantén a toda la liga informada.",
  },
];

export default function HomePage() {
  return (
    <main className="home-page">
      <section className="home-hero" aria-labelledby="home-hero-title">

        {/* Canvas de partículas */}
        <HeroCanvas />
        {/* Vignette + scanlines decorativos */}
        <div className="ff-hero-vignette" aria-hidden="true" />
        <div className="ff-hero-scanline" aria-hidden="true" />

        {/* HUD top bar con clock UTC en vivo */}
        <HUDBar />

        {/* Corner brackets */}
        <span className="ff-corner ff-corner-tl" aria-hidden="true" />
        <span className="ff-corner ff-corner-tr" aria-hidden="true" />
        <span className="ff-corner ff-corner-bl" aria-hidden="true" />
        <span className="ff-corner ff-corner-br" aria-hidden="true" />

        <div className="home-hero-grid">
          <div className="home-hero-copy">
            <div className="home-kicker-row">
              <span className="home-eyebrow">La plataforma del fútbol que se mueve contigo</span>
              <span className="home-hero-proof">
                Simple · Potente · Siempre disponible
              </span>
            </div>

            <h1
              className="home-headline home-headline-display"
              id="home-hero-title"
            >
              Tu fútbol merece
              <span className="home-headline-accent"> la mejor gestión</span>
            </h1>

            <p className="home-subline">
              LigaX es la plataforma todo-en-uno para organizar ligas, administrar
              clubes, registrar jugadores y vivir cada jornada al máximo. Fácil
              para todos, potente para los que lo necesitan.
            </p>

            <div className="home-hero-actions">
              <GlowButton variant="primary" icon="⚽" href="#roles">
                Crear mi Liga
              </GlowButton>
              <GlowButton variant="ghost" icon="▷" href="#como-funciona">
                Ver cómo funciona
              </GlowButton>
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
        id="como-funciona"
        aria-labelledby="home-status-title"
      >
        <div className="home-status-panel">
          <QuickChecks />
        </div>

        <div className="home-status-info">
          <span className="home-status-eyebrow">Cómo funciona</span>
          <h2 className="home-status-title" id="home-status-title">
            Tres pasos y listo para jugar
          </h2>
          <p className="home-status-subline">
            Sin tutoriales interminables ni configuraciones complejas.
            Regístrate, elige tu rol y empieza a gestionar tu liga en minutos.
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
        <span className="home-divider-label">¿Quién eres en la cancha?</span>
      </div>

      <section className="home-action" id="roles" aria-labelledby="roles-title">
        <div className="home-action-intro">
          <span className="home-action-eyebrow">Elige tu lugar</span>
          <h2 className="home-action-title" id="roles-title">
            Encuentra tu lugar en la plataforma
          </h2>
          <p className="home-action-subline">
            Ya seas organizador de liga, director de un club o jugador activo,
            LigaX tiene un espacio diseñado especialmente para vos.
          </p>
        </div>

        <ProfileSelector />
      </section>
    </main>
  );
}
