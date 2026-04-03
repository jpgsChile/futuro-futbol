"use client";

import { useEffect, useState } from "react";

type Slide = {
  id: string;
  type: "video" | "image";
  src: string;
  alt: string;
  tag: string;
  title: string;
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
    tag: "Video principal",
    title: "Momentum de partido",
  },
  {
    id: "hero-video-02",
    type: "video",
    src: "/hero/hero-loop-02.mp4",
    poster: "/hero/hero-loop-poster.svg",
    fallbackSrc: "/hero/hero-3d-02.svg",
    alt: "Clip de jugada intensa con iluminacion de estadio",
    tag: "Video destacado",
    title: "Intensidad competitiva",
  },
  {
    id: "hero-3d-1",
    type: "image",
    src: "/hero/hero-3d-01.svg",
    alt: "Balon 3D flotando en un estadio iluminado",
    tag: "3D visual",
    title: "Identidad de liga",
  },
  {
    id: "hero-3d-2",
    type: "image",
    src: "/hero/hero-3d-02.svg",
    alt: "Balon 3D con luces de estadio y grilla",
    tag: "Matchday",
    title: "Datos verificados",
  },
  {
    id: "hero-3d-3",
    type: "image",
    src: "/hero/hero-3d-03.svg",
    alt: "Balon 3D con energia y trazos dinamicos",
    tag: "On-chain",
    title: "Evidencia en tiempo real",
  },
];

const AUTO_DELAY = 6500;

export default function HeroCarousel() {
  const totalSlides = SLIDES.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [videoError, setVideoError] = useState(false);

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
    if (reduceMotion || paused || totalSlides <= 1) return;
    const intervalId = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, AUTO_DELAY);
    return () => window.clearInterval(intervalId);
  }, [paused, reduceMotion, totalSlides]);

  const prevIndex = (activeIndex - 1 + totalSlides) % totalSlides;
  const nextIndex = (activeIndex + 1) % totalSlides;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  };

  return (
    <div
      className="hero-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="hero-carousel-stage"
        role="region"
        aria-roledescription="carousel"
        aria-label="Galeria destacada de futbol"
      >
        {SLIDES.map((slide, index) => {
          const isActive = index === activeIndex;
          const isPrev = index === prevIndex;
          const isNext = index === nextIndex;
          const stateClass = isActive
            ? "is-active"
            : isPrev
            ? "is-prev"
            : isNext
            ? "is-next"
            : "is-hidden";

          const showVideo = slide.type === "video" && !videoError;
          const fallbackSrc =
            slide.fallbackSrc || slide.poster || slide.src;

          return (
            <div
              key={slide.id}
              className={`hero-carousel-slide ${stateClass}`}
              aria-hidden={!isActive}
            >
              {showVideo ? (
                <video
                  className="hero-carousel-media"
                  src={slide.src}
                  poster={slide.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onError={() => setVideoError(true)}
                />
              ) : (
                <img
                  className="hero-carousel-media"
                  src={fallbackSrc}
                  alt={slide.alt}
                  loading={isActive ? "eager" : "lazy"}
                />
              )}

              <div className="hero-carousel-overlay" aria-hidden="true" />

              <div className="hero-carousel-caption">
                <span className="hero-carousel-tag">{slide.tag}</span>
                <strong>{slide.title}</strong>
              </div>
            </div>
          );
        })}

        <div className="hero-carousel-controls">
          <button
            className="hero-carousel-btn"
            type="button"
            aria-label="Slide anterior"
            onClick={handlePrev}
          >
            {"<"}
          </button>
          <button
            className="hero-carousel-btn"
            type="button"
            aria-label="Slide siguiente"
            onClick={handleNext}
          >
            {">"}
          </button>
        </div>
      </div>

      <div className="hero-carousel-dots" role="tablist" aria-label="Slides">
        {SLIDES.map((slide, index) => (
          <button
            key={`${slide.id}-dot`}
            className={`hero-carousel-dot ${index === activeIndex ? "is-active" : ""}`}
            type="button"
            aria-label={`Ir a ${slide.tag}`}
            aria-current={index === activeIndex ? "true" : undefined}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
