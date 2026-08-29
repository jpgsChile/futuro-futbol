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
    alt: "Partido de fútbol con estadio iluminado",
    tag: "Jornada en vivo",
    eyebrow: "Resultados al instante",
    title: "Sigue cada partido como si estuvieras en la cancha.",
    description:
      "Registra goles, tarjetas y sustituciones en tiempo real. Toda la liga conectada al mismo ritmo que el juego.",
    metricLabel: "disponibilidad",
    metricValue: "24 / 7",
    chips: ["Resultados en vivo", "Estadísticas al día", "Siempre actualizado"],
  },
  {
    id: "hero-video-02",
    type: "video",
    src: "/hero/hero-loop-01.mp4",
    poster: "/hero/hero-loop-poster.svg",
    fallbackSrc: "/hero/hero-3d-02.svg",
    alt: "Gestión de equipos y clubes deportivos",
    tag: "Gestión total",
    eyebrow: "Todo en un lugar",
    title: "Todas las herramientas de tu liga en un solo lugar.",
    description:
      "Crea equipos, administra plantillas, programa partidos y sigue el rendimiento de cada club sin complicaciones.",
    metricLabel: "herramientas",
    metricValue: "Todo en uno",
    chips: ["Ligas", "Clubes", "Jugadores"],
  },
  {
    id: "hero-3d-1",
    type: "video",
    src: "/hero/hero-loop-01.mp4",
    poster: "/hero/hero-loop-poster.svg",
    fallbackSrc: "/hero/hero-3d-01.svg",
    alt: "Administración de clubes y equipos de fútbol",
    tag: "Clubes y equipos",
    eyebrow: "Gestión profesional",
    title: "Registra y administra cada club con precisión y claridad.",
    description:
      "Cada club tiene su espacio: jugadores registrados, partidos disputados, historial completo y estadísticas actualizadas.",
    metricLabel: "control",
    metricValue: "Completo",
    chips: ["Plantillas", "Historial", "Estadísticas"],
  },
  {
    id: "hero-3d-2",
    type: "video",
    src: "/hero/hero-loop-01.mp4",
    poster: "/hero/hero-loop-poster.svg",
    fallbackSrc: "/hero/hero-3d-02.svg",
    alt: "Historial de partidos y estadísticas de jugadores",
    tag: "Historial completo",
    eyebrow: "Datos confiables",
    title: "Cada estadística, cada resultado. Siempre disponible.",
    description:
      "Consulta el historial de cualquier partido, jugador o torneo. Toda la información de la liga al alcance de un click.",
    metricLabel: "registros",
    metricValue: "Permanentes",
    chips: ["Partidos", "Goles", "Clasificaciones"],
  },
  {
    id: "hero-3d-3",
    type: "video",
    src: "/hero/hero-loop-01.mp4",
    poster: "/hero/hero-loop-poster.svg",
    fallbackSrc: "/hero/hero-3d-03.svg",
    alt: "Plataforma premium de gestión deportiva",
    tag: "Experiencia premium",
    eyebrow: "Diseñado para ganar",
    title: "La plataforma que tu liga merece. Simple y poderosa.",
    description:
      "Interfaz limpia, flujos pensados para el fútbol real y un diseño que comunica profesionalismo desde el primer vistazo.",
    metricLabel: "experiencia",
    metricValue: "Nivel pro",
    chips: ["Diseño premium", "Fácil de usar", "Para todos"],
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
