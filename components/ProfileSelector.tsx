"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Connect = dynamic(() => import("@/components/Connect"), { ssr: false });

type ProfileId = "liga" | "club" | "jugador";

const PROFILES: {
  id: ProfileId;
  icon: string;
  label: string;
  subject: string;
  desc: string;
  entityClass: string;
  route: string;
}[] = [
  {
    id: "liga",
    icon: "🏆",
    label: "Soy Liga",
    subject: "Liga",
    desc: "Gestiono ligas, torneos y estructura general.",
    entityClass: "entity-league",
    route: "/entidades/crear-liga",
  },
  {
    id: "club",
    icon: "⚽",
    label: "Soy Club",
    subject: "Club",
    desc: "Administro mi equipo, jugadores y operación deportiva.",
    entityClass: "entity-club",
    route: "/entidades/crear-club",
  },
  {
    id: "jugador",
    icon: "👤",
    label: "Soy Jugador",
    subject: "Jugador",
    desc: "Consulto mi perfil, participación y actividad.",
    entityClass: "entity-player",
    route: "/lecturas/jugador",
  },
];

export default function ProfileSelector() {
  const [selected, setSelected] = useState<ProfileId | null>(null);
  const { isConnected } = useAccount();
  const router = useRouter();

  const selectedProfile = PROFILES.find((p) => p.id === selected) ?? null;

  return (
    <div className="profile-selector">

      {/* ── 3 cards de rol ──────────────────────────────────── */}
      <div className="profile-grid">
        {PROFILES.map((profile) => {
          const isSelected = selected === profile.id;
          return (
            <button
              key={profile.id}
              type="button"
              className={`profile-card ${profile.entityClass}${
                isSelected ? " profile-card-selected" : ""
              }`}
              onClick={() => setSelected(profile.id)}
              aria-pressed={isSelected}
            >
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
                Conectá tu wallet para continuar como{" "}
                <strong>{selectedProfile?.subject}</strong>
              </p>
              <Connect />
            </>
          ) : (
            <>
              <p className="profile-connect-hint profile-connect-hint-ok">
                ✓ Wallet conectada — continuando como{" "}
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
