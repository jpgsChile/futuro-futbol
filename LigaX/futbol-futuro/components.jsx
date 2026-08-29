/* global React */
const { useState, useEffect, useRef } = React;

// ============================================================
// FUTURO FÚTBOL — Futurist High-Tech component set
// Palette: Deep black/navy + neon green + electric blue
// ============================================================

// Glow-edge button
function GlowButton({ children, variant = "primary", icon, onClick }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      className={`ff-btn ff-btn-${variant} ${pressed ? "is-pressed" : ""}`}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onClick={onClick}
    >
      <span className="ff-btn-bg" />
      <span className="ff-btn-rim" />
      <span className="ff-btn-content">
        {icon && <span className="ff-btn-icon">{icon}</span>}
        <span>{children}</span>
        <span className="ff-btn-arrow">→</span>
      </span>
      <span className="ff-btn-glow" />
    </button>
  );
}

// HUD ticker chip
function HUDChip({ children, dot, color = "lime" }) {
  return (
    <span className={`ff-chip ff-chip-${color}`}>
      {dot && <span className="ff-chip-dot" />}
      {children}
    </span>
  );
}

// ──────────────────────────────────────────────────────────
// HERO SECTION
// ──────────────────────────────────────────────────────────
function HeroSection() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  // Animated abstract background — particle field with pitch lines
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    const W = () => canvas.getBoundingClientRect().width;
    const H = () => canvas.getBoundingClientRect().height;

    // Particles representing data flow
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.4 + 0.4,
      hue: Math.random() > 0.5 ? 145 : 230,
    }));

    let t = 0;
    const draw = () => {
      const w = W();
      const h = H();
      ctx.clearRect(0, 0, w, h);

      // Pitch grid (perspective)
      ctx.strokeStyle = "rgba(57, 255, 139, 0.06)";
      ctx.lineWidth = 1;
      const horizon = h * 0.45;
      for (let i = 0; i < 14; i++) {
        const y = horizon + Math.pow(i / 14, 2) * (h - horizon);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      for (let i = -8; i <= 8; i++) {
        const x = w / 2 + i * (w / 16);
        ctx.beginPath();
        ctx.moveTo(w / 2, horizon);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy + Math.sin(t * 0.01 + p.x * 0.01) * 0.1;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 65%, 0.7)`;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 60%, 0.8)`;
        ctx.shadowBlur = 8;
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // Connection lines between near particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.strokeStyle = `rgba(61, 127, 255, ${(1 - d / 110) * 0.18})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Cursor halo
      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.08;
      const grad = ctx.createRadialGradient(
        mouseRef.current.x, mouseRef.current.y, 0,
        mouseRef.current.x, mouseRef.current.y, 220
      );
      grad.addColorStop(0, "rgba(57, 255, 139, 0.15)");
      grad.addColorStop(1, "rgba(57, 255, 139, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      t++;
      raf = requestAnimationFrame(draw);
    };
    draw();

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current.tx = e.clientX - r.left;
      mouseRef.current.ty = e.clientY - r.top;
    };
    canvas.addEventListener("mousemove", onMove);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="ff-hero" data-screen-label="01 Hero">
      <canvas ref={canvasRef} className="ff-hero-canvas" />
      <div className="ff-hero-vignette" />
      <div className="ff-hero-scanline" />

      {/* HUD top bar */}
      <div className="ff-hero-hud-top">
        <div className="ff-hud-cluster">
          <HUDChip dot color="lime">SYSTEM ONLINE</HUDChip>
          <HUDChip color="dim">AVALANCHE · CHAIN 43113</HUDChip>
          <HUDChip color="dim">BLOCK 12,847,332</HUDChip>
        </div>
        <div className="ff-hud-cluster">
          <span className="ff-hud-time" id="ff-clock">22:47:03 UTC</span>
          <HUDChip color="cyan">v2.1.0-alpha</HUDChip>
        </div>
      </div>

      <div className="ff-hero-content">
        <div className="ff-hero-eyebrow">
          <span className="ff-eyebrow-bracket">[</span>
          <span className="ff-eyebrow-text">Web3 · Matchday Infrastructure</span>
          <span className="ff-eyebrow-bracket">]</span>
        </div>

        <h1 className="ff-hero-title">
          <span className="ff-hero-title-line">El fútbol</span>
          <span className="ff-hero-title-line ff-hero-title-accent">
            entra en la
            <span className="ff-hero-title-glow">red</span>
          </span>
          <span className="ff-hero-title-line">verificable.</span>
        </h1>

        <p className="ff-hero-subtitle">
          Identidad on-chain, evidencia IPFS y permisos firmados para ligas, clubes
          y jugadores. Una capa operativa que se siente como una consola, no como
          un dashboard.
        </p>

        <div className="ff-hero-actions">
          <GlowButton variant="primary" icon="◈">Mint Identity</GlowButton>
          <GlowButton variant="ghost" icon="⌬">Connect Wallet</GlowButton>
        </div>

        <div className="ff-hero-meta">
          <div className="ff-hero-meta-item">
            <span className="ff-hero-meta-label">TVL Locked</span>
            <span className="ff-hero-meta-value">2,847.32 <em>AVAX</em></span>
          </div>
          <div className="ff-hero-meta-divider" />
          <div className="ff-hero-meta-item">
            <span className="ff-hero-meta-label">Identities</span>
            <span className="ff-hero-meta-value">12,481</span>
          </div>
          <div className="ff-hero-meta-divider" />
          <div className="ff-hero-meta-item">
            <span className="ff-hero-meta-label">Matches Logged</span>
            <span className="ff-hero-meta-value">948</span>
          </div>
          <div className="ff-hero-meta-divider" />
          <div className="ff-hero-meta-item">
            <span className="ff-hero-meta-label">Latency</span>
            <span className="ff-hero-meta-value ff-pulse">2.1s</span>
          </div>
        </div>
      </div>

      {/* corner brackets */}
      <span className="ff-corner ff-corner-tl" />
      <span className="ff-corner ff-corner-tr" />
      <span className="ff-corner ff-corner-bl" />
      <span className="ff-corner ff-corner-br" />
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// PLAYER CAROUSEL — glassmorphism + rim light
// ──────────────────────────────────────────────────────────
const PLAYERS = [
  {
    id: "p01",
    name: "Mateo Vázquez",
    role: "Forward",
    club: "Real Cosmos FC",
    rating: 94,
    cap: "F-09",
    accent: "lime",
    stats: { goals: 28, assists: 12, matches: 31 },
    tag: "GENESIS · #001",
    hue: 145,
  },
  {
    id: "p02",
    name: "Yusuf El-Amin",
    role: "Midfielder",
    club: "Tokyo Neon",
    rating: 91,
    cap: "M-08",
    accent: "blue",
    stats: { goals: 9, assists: 21, matches: 30 },
    tag: "LEGEND · #014",
    hue: 230,
  },
  {
    id: "p03",
    name: "Lukas Brandt",
    role: "Defender",
    club: "Berlin Synth",
    rating: 89,
    cap: "D-04",
    accent: "lime",
    stats: { goals: 2, assists: 4, matches: 33 },
    tag: "RARE · #208",
    hue: 145,
  },
  {
    id: "p04",
    name: "Nadia Okafor",
    role: "Goalkeeper",
    club: "Lagos Voltage",
    rating: 92,
    cap: "G-01",
    accent: "blue",
    stats: { goals: 0, assists: 1, matches: 28 },
    tag: "UNIQUE · #042",
    hue: 230,
  },
  {
    id: "p05",
    name: "Ren Takeda",
    role: "Winger",
    club: "Osaka Pulse",
    rating: 88,
    cap: "F-11",
    accent: "lime",
    stats: { goals: 18, assists: 14, matches: 32 },
    tag: "GENESIS · #007",
    hue: 145,
  },
];

function PlayerCard({ player, active }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50, hov: false });

  const handleMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    setTilt({
      rx: (0.5 - y) * 12,
      ry: (x - 0.5) * 14,
      mx: x * 100,
      my: y * 100,
      hov: true,
    });
  };
  const handleLeave = () => setTilt({ rx: 0, ry: 0, mx: 50, my: 50, hov: false });

  const accentColor = player.accent === "lime" ? "#39FF8B" : "#3D7FFF";

  return (
    <div
      ref={ref}
      className={`ff-card ${active ? "is-active" : ""} ${tilt.hov ? "is-hover" : ""}`}
      data-accent={player.accent}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transform: `perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        "--mx": `${tilt.mx}%`,
        "--my": `${tilt.my}%`,
        "--accent": accentColor,
      }}
    >
      {/* rim light gradient ring */}
      <div className="ff-card-rim" />
      {/* inner glassy panel */}
      <div className="ff-card-inner">
        {/* hover spotlight */}
        <div className="ff-card-spotlight" />
        {/* scanlines + grid */}
        <div className="ff-card-grid" />

        {/* top bar */}
        <div className="ff-card-top">
          <span className="ff-card-tag">{player.tag}</span>
          <span className="ff-card-cap">{player.cap}</span>
        </div>

        {/* player visual placeholder */}
        <div className="ff-card-visual">
          <div className="ff-card-glow" />
          <div className="ff-card-orbit ff-card-orbit-1" />
          <div className="ff-card-orbit ff-card-orbit-2" />
          <svg className="ff-card-silhouette" viewBox="0 0 120 160" aria-hidden="true">
            <defs>
              <linearGradient id={`grad-${player.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accentColor} stopOpacity="0.9" />
                <stop offset="100%" stopColor={accentColor} stopOpacity="0.1" />
              </linearGradient>
            </defs>
            {/* abstract player silhouette — head + torso geometry */}
            <circle cx="60" cy="38" r="18" fill={`url(#grad-${player.id})`} opacity="0.95" />
            <path
              d="M30 150 Q30 80 60 70 Q90 80 90 150 Z"
              fill={`url(#grad-${player.id})`}
              opacity="0.9"
            />
            <path
              d="M30 150 Q30 80 60 70 Q90 80 90 150"
              fill="none"
              stroke={accentColor}
              strokeWidth="1.2"
              opacity="0.9"
            />
          </svg>
          <div className="ff-card-rating">
            <span className="ff-card-rating-num">{player.rating}</span>
            <span className="ff-card-rating-label">OVR</span>
          </div>
        </div>

        {/* identity */}
        <div className="ff-card-id">
          <span className="ff-card-role">{player.role.toUpperCase()}</span>
          <h3 className="ff-card-name">{player.name}</h3>
          <span className="ff-card-club">{player.club}</span>
        </div>

        {/* stats */}
        <div className="ff-card-stats">
          <div className="ff-card-stat">
            <span className="ff-card-stat-num">{player.stats.goals}</span>
            <span className="ff-card-stat-lbl">GLS</span>
          </div>
          <div className="ff-card-stat">
            <span className="ff-card-stat-num">{player.stats.assists}</span>
            <span className="ff-card-stat-lbl">AST</span>
          </div>
          <div className="ff-card-stat">
            <span className="ff-card-stat-num">{player.stats.matches}</span>
            <span className="ff-card-stat-lbl">MP</span>
          </div>
        </div>

        {/* footer */}
        <div className="ff-card-footer">
          <span className="ff-card-chain">
            <span className="ff-chain-dot" />
            On-chain · 0x4A…F2C1
          </span>
          <button className="ff-card-cta">
            VIEW <span>↗</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function PlayerCarousel() {
  const [active, setActive] = useState(2);
  const total = PLAYERS.length;

  const handlePrev = () => setActive((a) => (a - 1 + total) % total);
  const handleNext = () => setActive((a) => (a + 1) % total);

  return (
    <section className="ff-carousel-wrap" data-screen-label="02 Carousel">
      <div className="ff-section-head">
        <div>
          <span className="ff-section-eyebrow">⌁ FEATURED ROSTER</span>
          <h2 className="ff-section-title">Identity Drop · Season 04</h2>
          <p className="ff-section-sub">
            Tarjetas firmadas on-chain. Cada jugador es un token verificable con
            historial de partidos, evidencia y attestations.
          </p>
        </div>
        <div className="ff-carousel-nav">
          <button className="ff-nav-btn" onClick={handlePrev} aria-label="Previous">‹</button>
          <span className="ff-nav-counter">
            <strong>{String(active + 1).padStart(2, "0")}</strong>
            <span className="ff-nav-counter-sep">/</span>
            {String(total).padStart(2, "0")}
          </span>
          <button className="ff-nav-btn" onClick={handleNext} aria-label="Next">›</button>
        </div>
      </div>

      <div className="ff-carousel-track">
        <div
          className="ff-carousel-rail"
          style={{ transform: `translateX(calc(50% - ${active * 360}px - 180px))` }}
        >
          {PLAYERS.map((p, i) => (
            <div
              key={p.id}
              className={`ff-carousel-slot ${i === active ? "is-active" : ""}`}
              onClick={() => setActive(i)}
              style={{
                "--offset": Math.abs(i - active),
              }}
            >
              <PlayerCard player={p} active={i === active} />
            </div>
          ))}
        </div>

        {/* edge fades */}
        <div className="ff-carousel-fade ff-carousel-fade-l" />
        <div className="ff-carousel-fade ff-carousel-fade-r" />
      </div>

      {/* progress rail */}
      <div className="ff-carousel-progress">
        {PLAYERS.map((_, i) => (
          <button
            key={i}
            className={`ff-progress-tick ${i === active ? "is-active" : ""}`}
            onClick={() => setActive(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// HOVER DEMO — single oversized card showcasing the effects
// ──────────────────────────────────────────────────────────
function HoverShowcase() {
  return (
    <section className="ff-hover-demo" data-screen-label="03 Hover Demo">
      <div className="ff-hover-demo-info">
        <span className="ff-section-eyebrow">⌁ INTERACTION SPEC</span>
        <h2 className="ff-section-title">Hover · 3D tilt + neon rim</h2>
        <p className="ff-section-sub">
          Movimiento del mouse → rotación X/Y de hasta 14°. El borde proyecta un
          rim light que sigue al cursor. La sombra se intensifica para sugerir
          flotación. Animado con Framer Motion (spring stiffness 220, damping 22).
        </p>
        <ul className="ff-spec-list">
          <li><span className="ff-spec-key">transform</span><span>perspective(1100px) rotateX/Y</span></li>
          <li><span className="ff-spec-key">rim</span><span>conic-gradient mask follows cursor</span></li>
          <li><span className="ff-spec-key">glow</span><span>radial-gradient @ mouse position</span></li>
          <li><span className="ff-spec-key">shadow</span><span>0 30px 80px rgba(0,0,0,.6)</span></li>
          <li><span className="ff-spec-key">spring</span><span>{`{ stiffness: 220, damping: 22 }`}</span></li>
        </ul>

        <div className="ff-spec-chips">
          <HUDChip dot color="lime">framer-motion</HUDChip>
          <HUDChip color="cyan">whileHover</HUDChip>
          <HUDChip color="dim">prefers-reduced-motion ✓</HUDChip>
        </div>
      </div>

      <div className="ff-hover-demo-stage">
        <div className="ff-hover-demo-shadow" />
        <PlayerCard player={PLAYERS[0]} active />
        <div className="ff-cursor-hint">
          <span className="ff-cursor-dot" />
          mover el cursor
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// FULL PROTOTYPE — the page assembled
// ──────────────────────────────────────────────────────────
function FuturoFutbolPage() {
  // Live clock
  useEffect(() => {
    const tick = () => {
      const el = document.getElementById("ff-clock");
      if (!el) return;
      const d = new Date();
      const h = String(d.getUTCHours()).padStart(2, "0");
      const m = String(d.getUTCMinutes()).padStart(2, "0");
      const s = String(d.getUTCSeconds()).padStart(2, "0");
      el.textContent = `${h}:${m}:${s} UTC`;
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="ff-prototype">
      <nav className="ff-nav" data-screen-label="00 Nav">
        <div className="ff-nav-brand">
          <span className="ff-nav-logo">
            <span className="ff-nav-logo-ring" />
            <span className="ff-nav-logo-dot" />
          </span>
          <div className="ff-nav-brand-text">
            <strong>FUTURO FÚTBOL</strong>
            <span>matchday · on-chain</span>
          </div>
        </div>
        <ul className="ff-nav-links">
          <li className="is-active">Pitch</li>
          <li>Roster</li>
          <li>Matches</li>
          <li>Attestations</li>
          <li>Vault</li>
        </ul>
        <div className="ff-nav-actions">
          <span className="ff-nav-bal">
            <em>2.481</em> AVAX
          </span>
          <button className="ff-nav-wallet">
            <span className="ff-nav-wallet-dot" />
            0x4A…F2C1
          </button>
        </div>
      </nav>

      <HeroSection />
      <PlayerCarousel />
      <HoverShowcase />
    </div>
  );
}

window.FuturoFutbolPage = FuturoFutbolPage;
window.HeroSection = HeroSection;
window.PlayerCarousel = PlayerCarousel;
window.HoverShowcase = HoverShowcase;
window.PlayerCard = PlayerCard;
