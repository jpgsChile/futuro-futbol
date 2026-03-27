import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import QuickChecks from "@/components/QuickChecks";

const Connect = dynamic(() => import("@/components/Connect"), { ssr: false });

export default function HomePage() {
  return (
    <main className="container">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero-card">
        <div className="hero-inner">
          {/* Left: brand + copy + CTA */}
          <div>
            <div className="hero-badge">⚽ Avalanche Fuji Testnet</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
              <Image
                src="/futurofutbol_logo.jpeg"
                alt="LigaX"
                width={56}
                height={56}
                style={{ borderRadius: 12, flexShrink: 0 }}
              />
              <h1 className="hero-title" style={{ margin: 0 }}>LigaX</h1>
            </div>
            <p className="hero-desc">
              Gestión de ligas, clubes, jugadores y partidos en blockchain.
              Evidencia IPFS, roles on-chain y attestations para el fútbol que
              merece transparencia real.
            </p>
            <div className="hero-actions">
              <Connect />
              <Link href="/entidades/crear-liga" className="button">⚡ Crear Liga</Link>
              <Link href="/lecturas/liga" className="btn">Consultar datos</Link>
            </div>
          </div>

          {/* Right: stats */}
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value">9</div>
              <div className="hero-stat-label">Contratos</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">43113</div>
              <div className="hero-stat-label">Chain ID</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">IPFS</div>
              <div className="hero-stat-label">Evidencia</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Dashboard layout: main + sidebar ─────────────── */}
      <div className="home-dashboard">

        {/* ── Columna principal ──────────────────────────── */}
        <div className="home-main">

          {/* Features */}
          <div className="card">
            <h3 style={{ marginBottom: 20 }}>¿Qué ofrece la plataforma?</h3>
            <ul className="feature-list">
              <li className="feature-item">
                <div className="feature-icon">🔐</div>
                <div className="feature-text">
                  <strong>Control de roles on-chain</strong>
                  <span>LEAGUE_ROLE, CLUB_ROLE, REFEREE_ROLE y protección a menores.</span>
                </div>
              </li>
              <li className="feature-item">
                <div className="feature-icon">📁</div>
                <div className="feature-text">
                  <strong>Evidencia inmutable</strong>
                  <span>Metadata IPFS para eventos y partidos, enlazada on-chain.</span>
                </div>
              </li>
              <li className="feature-item">
                <div className="feature-icon">🔍</div>
                <div className="feature-text">
                  <strong>Transparencia total</strong>
                  <span>Historial completo de eventos, reputación y alineaciones.</span>
                </div>
              </li>
              <li className="feature-item">
                <div className="feature-icon">🦊</div>
                <div className="feature-text">
                  <strong>Core Wallet nativo</strong>
                  <span>Firma y conexión optimizadas para Avalanche.</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Quick start */}
          <div className="card">
            <h3 style={{ marginBottom: 20 }}>Empezar en 4 pasos</h3>
            <ol className="steps">
              <li className="step-item">
                <div className="step-num">1</div>
                <div className="step-text">Conecta tu wallet (Core Wallet o MetaMask) en la red Fuji.</div>
              </li>
              <li className="step-item">
                <div className="step-num">2</div>
                <div className="step-text">Solicita o asigna el rol adecuado (Liga, Club, Árbitro).</div>
              </li>
              <li className="step-item">
                <div className="step-num">3</div>
                <div className="step-text">Crea una liga y sus clubes, luego registra jugadores.</div>
              </li>
              <li className="step-item">
                <div className="step-num">4</div>
                <div className="step-text">Programa partidos con metadata IPFS y registra eventos en vivo.</div>
              </li>
            </ol>
            <div className="row" style={{ marginTop: 20 }}>
              <Link href="/entidades/crear-liga" className="button">Crear Liga</Link>
              <Link href="/entidades/registrar-jugador" className="btn">Registrar Jugador</Link>
            </div>
          </div>

        </div>

        {/* ── Columna lateral ─────────────────────────────── */}
        <aside className="home-sidebar">

          {/* Wallet status — componente dinámico */}
          <QuickChecks />

          {/* Diagnóstico */}
          <div className="card">
            <h3 style={{ marginBottom: 16, fontSize: 15 }}>Diagnóstico de transacciones</h3>
            <ul className="feature-list">
              <li className="feature-item">
                <div className="feature-icon">🌐</div>
                <div className="feature-text">
                  <strong>Red Fuji (43113) activa</strong>
                  <span>Verifica que el pill de red sea verde en el navbar.</span>
                </div>
              </li>
              <li className="feature-item">
                <div className="feature-icon">💰</div>
                <div className="feature-text">
                  <strong>Saldo AVAX suficiente</strong>
                  <span>Usa el Faucet si necesitas gas de prueba.</span>
                </div>
              </li>
              <li className="feature-item">
                <div className="feature-icon">🎫</div>
                <div className="feature-text">
                  <strong>Permisos requeridos</strong>
                  <span>Si ves "Not authorized", asigna el rol en /roles/asignar.</span>
                </div>
              </li>
            </ul>
          </div>

        </aside>
      </div>
    </main>
  );
}
