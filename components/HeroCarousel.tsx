"use client";

import { useEffect, useRef, useState } from "react";

type Slide = {
  id: string;
  type: "video" | "image";
  src: string;
  alt: string;
  tag: string;
  eyebrow: string;
  title: string;
  description: string;
  metricLabel: string;
  metricValue: string;
  chips: string[];
  poster?: string;
  fallbackSrc?: string;
};

const SLIDES: Slide[] = [
  {
    id: "hero-video-01",
    type: "video",
    src: "/hero/hero-loop-01.mp4",
    poster: "/hero/hero-loop-poster.svg",
    fallbackSrc: "/hero/hero-3d-01.svg",
    alt: "Clip de accion en estadio con foco en el balon",
    tag: "Matchday feed",
    eyebrow: "Command visibility",
    title: "La jornada entra en una capa operativa visible.",
    description:
      "El estado del partido, los permisos y la evidencia se sienten como una consola premium, no como un panel improvisado.",
    metricLabel: "trace depth",
    metricValue: "24/7",
    chips: ["Roles firmados", "Timeline live", "Sync visual"],
  },
  {
    id: "hero-video-02",
    type: "video",
    src: "/hero/hero-loop-01.mp4",
    poster: "/hero/hero-loop-poster.svg",
    fallbackSrc: "/hero/hero-3d-02.svg",
    alt: "Clip de jugada intensa con iluminacion de estadio",
    tag: "Control rail",
    eyebrow: "Operator speed",
    title: "Permisos y acciones aterrizados en una sola superficie.",
    description:
      "Wallet, lectura on-chain y flujos de ejecucion se conectan con una jerarquia clara para tomar decisiones rapidas.",
    metricLabel: "role checks",
    metricValue: "100%",
    chips: ["Wallet ready", "League ops", "Club actions"],
  },
  {
    id: "hero-3d-1",
    type: "video",
    src: "/hero/hero-loop-01.mp4",
    poster: "/hero/hero-loop-poster.svg",
    fallbackSrc: "/hero/hero-3d-01.svg",
    alt: "Balon 3D flotando en un estadio iluminado",
    tag: "Identity layer",
    eyebrow: "Entity graph",
    title: "Cada club y jugador vive dentro de una identidad verificable.",
    description:
      "La estructura de entidades no es decorativa: define quien opera, quien valida y que lectura sostiene cada flujo.",
    metricLabel: "entities mapped",
    metricValue: "League wide",
    chips: ["Clubs", "Players", "Permissions"],
  },
  {
    id: "hero-3d-2",
    type: "video",
    src: "/hero/hero-loop-01.mp4",
    poster: "/hero/hero-loop-poster.svg",
    fallbackSrc: "/hero/hero-3d-02.svg",
    alt: "Balon 3D con luces de estadio y grilla",
    tag: "Proof trail",
    eyebrow: "Data credibility",
    title: "La evidencia deja de ser un adjunto y pasa a ser infraestructura.",
    description:
      "Partidos, attestations e IPFS conviven en una narrativa visual lista para auditoria, consulta y continuidad operativa.",
    metricLabel: "evidence path",
    metricValue: "IPFS + attest",
    chips: ["Hash trail", "Read ready", "Proof grade"],
  },
  {
    id: "hero-3d-3",
    type: "video",
    src: "/hero/hero-loop-01.mp4",
    poster: "/hero/hero-loop-poster.svg",
    fallbackSrc: "/hero/hero-3d-03.svg",
    alt: "Balon 3D con energia y trazos dinamicos",
    tag: "Execution tone",
    eyebrow: "Premium rhythm",
    title: "La experiencia combina tension de partido con control de producto.",
    description:
      "Visual fuerte, motion sobrio y lectura limpia para que el lenguaje Web3 se vea serio, actual y listo para produccion.",
    metricLabel: "visual system",
    metricValue: "Cinematic",
    chips: ["Depth", "Motion", "Credibility"],
  },
];

const AUTO_DELAY = 6500;

function getSlidePosition(index: number, activeIndex: number, total: number) {
  if (index === activeIndex) return "is-active";

  const forwardDistance = (index - activeIndex + total) % total;
  const backwardDistance = (activeIndex - index + total) % total;

  return forwardDistance <= backwardDistance ? "is-after" : "is-before";
}

export default function HeroCarousel() {
  const totalSlides = SLIDES.length;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [inView, setInView] = useState(true);
  const [brokenVideos, setBrokenVideos] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReduceMotion(media.matches);

    updateMotion();

    if (media.addEventListener) {
      media.addEventListener("change", updateMotion);
      return () => media.removeEventListener("change", updateMotion);
    }

    media.addListener(updateMotion);
    return () => media.removeListener(updateMotion);
  }, []);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.45 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduceMotion || paused || !inView || totalSlides <= 1) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, AUTO_DELAY);

    return () => window.clearInterval(intervalId);
  }, [inView, paused, reduceMotion, totalSlides]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const videos = Array.from(node.querySelectorAll("video"));

    videos.forEach((video) => {
      const slideIndex = Number(video.dataset.index);
      const slide = SLIDES[slideIndex];
      const isBroken = slide ? brokenVideos[slide.id] : false;
      const shouldPlay =
        !reduceMotion &&
        inView &&
        slideIndex === activeIndex &&
        !isBroken;

      if (shouldPlay) {
        video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    });
  }, [activeIndex, brokenVideos, inView, reduceMotion]);

  const goToIndex = (nextIndex: number) => {
    setActiveIndex((nextIndex + totalSlides) % totalSlides);
  };

  const handlePrev = () => goToIndex(activeIndex - 1);
  const handleNext = () => goToIndex(activeIndex + 1);

  const isMotionPaused = paused || reduceMotion || !inView;
  const counterLabel = `${String(activeIndex + 1).padStart(2, "0")} / ${String(
    totalSlides
  ).padStart(2, "0")}`;

  return (
    <div
      ref={rootRef}
      className={`showcase-carousel ${isMotionPaused ? "is-paused" : ""}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        className="showcase-carousel-stage"
        role="region"
        aria-roledescription="carousel"
        aria-label="Galeria destacada de LigaX"
      >
        {SLIDES.map((slide, index) => {
          const positionClass = getSlidePosition(index, activeIndex, totalSlides);
          const isActive = index === activeIndex;
          const previewSrc = slide.poster || slide.fallbackSrc || slide.src;
          const showVideo =
            slide.type === "video" &&
            !reduceMotion &&
            !brokenVideos[slide.id];

          return (
            <article
              key={slide.id}
              className={`showcase-carousel-slide ${positionClass}`}
              aria-hidden={!isActive}
            >
              {showVideo ? (
                <video
                  className="showcase-carousel-media"
                  data-index={index}
                  src={slide.src}
                  poster={slide.poster}
                  muted
                  loop
                  playsInline
                  preload={isActive ? "auto" : "metadata"}
                  onError={() =>
                    setBrokenVideos((current) => ({
                      ...current,
                      [slide.id]: true,
                    }))
                  }
                />
              ) : (
                <img
                  className="showcase-carousel-media"
                  src={previewSrc}
                  alt={slide.alt}
                  loading={isActive ? "eager" : "lazy"}
                />
              )}

              <div className="showcase-carousel-overlay" aria-hidden="true" />
            </article>
          );
        })}
      </div>

      <div
        className="showcase-carousel-preview-rail"
        role="tablist"
        aria-label="Escenas destacadas"
      >
        {SLIDES.map((slide, index) => {
          const previewSrc = slide.poster || slide.fallbackSrc || slide.src;
          const isActive = index === activeIndex;

          return (
            <button
              key={`${slide.id}-preview`}
              className={`showcase-carousel-preview ${
                isActive ? "is-active" : ""
              }`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Ir a ${slide.tag}`}
              onClick={() => goToIndex(index)}
            >
              <img
                className="showcase-carousel-preview-media"
                src={previewSrc}
                alt=""
                loading="lazy"
                aria-hidden="true"
              />
              <span className="showcase-carousel-preview-copy">
                <span className="showcase-carousel-preview-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <strong>{slide.tag}</strong>
                <span>{slide.metricValue}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="showcase-carousel-footer">
        <div className="showcase-carousel-progress" aria-hidden="true">
          <span key={activeIndex} className="showcase-carousel-progress-value" />
        </div>

        <div className="showcase-carousel-controls">
          <button
            className="showcase-carousel-btn"
            type="button"
            aria-label="Escena anterior"
            onClick={handlePrev}
          >
            {"<"}
          </button>
          <div className="showcase-carousel-counter">{counterLabel}</div>
          <button
            className="showcase-carousel-btn"
            type="button"
            aria-label="Escena siguiente"
            onClick={handleNext}
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
}
