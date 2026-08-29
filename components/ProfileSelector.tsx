"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Connect = dynamic(() => import("@/components/Connect"), { ssr: false });

type ProfileId = "liga" | "club" | "jugador";
type Tilt = { rx: number; ry: number; mx: number; my: number; hov: boolean };

const DEFAULT_TILT: Tilt = { rx: 0, ry: 0, mx: 50, my: 50, hov: false };

const PROFILES: {
  id: ProfileId;
  icon: string;
  label: string;
  subject: string;
  desc: string;
  entityClass: string;
  route: string;
  accent: string;
}[] = [
  {
    id: "liga",
    icon: "🏆",
    label: "Organizo una liga",
    subject: "Organizador",
    desc: "Crea torneos, gestiona el calendario, registra equipos y controla toda la competencia.",
    entityClass: "entity-league",
    route: "/entidades/crear-liga",
    accent: "#3D7FFF",
  },
  {
    id: "club",
    icon: "⚽",
    label: "Dirijo un club",
    subject: "Director de club",
    desc: "Administra tu equipo, registra jugadores y lleva el seguimiento de cada partido.",
    entityClass: "entity-club",
    route: "/entidades/crear-club",
    accent: "#39FF8B",
  },
  {
    id: "jugador",
    icon: "👤",
    label: "Soy jugador",
    subject: "Jugador",
    desc: "Consulta tu historial, estadísticas, partidos jugados y actividad en la liga.",
    entityClass: "entity-player",
    route: "/lecturas/jugador",
    accent: "#FFB53D",
  },
];

export default function ProfileSelector() {
  const [selected, setSelected] = useState<ProfileId | null>(null);
  const [tilts, setTilts] = useState<Record<ProfileId, Tilt>>({
    liga: DEFAULT_TILT,
    club: DEFAULT_TILT,
    jugador: DEFAULT_TILT,
  });

  const { isConnected } = useAccount();
  const router = useRouter();

  const selectedProfile = PROFILES.find((p) => p.id === selected) ?? null;

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>, id: ProfileId) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    setTilts((prev) => ({
      ...prev,
      [id]: { rx: (0.5 - y) * 10, ry: (x - 0.5) * 13, mx: x * 100, my: y * 100, hov: true },
    }));
  };

  const handleLeave = (id: ProfileId) => {
    setTilts((prev) => ({ ...prev, [id]: DEFAULT_TILT }));
  };

  return (
    <div className="profile-selector">

      {/* ── 3 cards de rol con tilt 3D ──────────────────────── */}
      <div className="profile-grid">
        {PROFILES.map((profile) => {
          const isSelected = selected === profile.id;
          const tilt = tilts[profile.id];
          return (
            <button
              key={profile.id}
              type="button"
              className={`profile-card ${profile.entityClass}${isSelected ? " profile-card-selected" : ""}${tilt.hov ? " is-hover" : ""}`}
              onClick={() => setSelected(profile.id)}
              aria-pressed={isSelected}
              onMouseMove={(e) => handleMove(e, profile.id)}
              onMouseLeave={() => handleLeave(profile.id)}
              style={{
                transform: `perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                "--mx": `${tilt.mx}%`,
                "--my": `${tilt.my}%`,
                "--accent": profile.accent,
              } as React.CSSProperties}
            >
              {/* rim light cónico */}
              <span className="ff-card-rim" aria-hidden="true" />
              {/* spotlight que sigue al cursor */}
              <span className="ff-card-spotlight" aria-hidden="true" />

              <span className="profile-card-icon">{profile.icon}</span>
              <span className="profile-card-label">{profile.label}</span>
              <span className="profile-card-desc">{profile.desc}</span>
              {isSelected && (
                <span className="profile-card-check">✓ Seleccionado</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Bloque de conexión: se revela al elegir perfil ─── */}
      {selected && (
        <div className="profile-connect">
          {!isConnected ? (
            <>
              <p className="profile-connect-hint">
                Inicia sesión para continuar como{" "}
                <strong>{selectedProfile?.subject}</strong> y acceder a todas las funciones.
              </p>
              <Connect />
            </>
          ) : (
            <>
              <p className="profile-connect-hint profile-connect-hint-ok">
                ✓ Sesión activa — entrando como{" "}
                <strong>{selectedProfile?.subject}</strong>
              </p>
              <button
                type="button"
                className="button"
                onClick={() =>
                  selectedProfile && router.push(selectedProfile.route)
                }
              >
                Ir a mi sección →
              </button>
            </>
          )}
        </div>
      )}

    </div>
  );
}
