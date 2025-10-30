"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useAccount, useBalance, useChainId, useSwitchChain } from "wagmi";
import { avalancheFuji } from "viem/chains";

type Item = { label: string; href: string };
type Section = { title: string; items: Item[] };

const SECTIONS: Section[] = [
	{
		title: "Gestión de Entidades",
		items: [
			{ label: "Crear nueva liga", href: "/entidades/crear-liga" },
			{ label: "Crear nuevo club", href: "/entidades/crear-club" },
			{ label: "Registrar jugador", href: "/entidades/registrar-jugador" },
			{ label: "Unir jugador a un club", href: "/entidades/unir-jugador-club" }
		]
	},
	{
		title: "Gestión de Partidos",
		items: [
			{ label: "Crear partido básico", href: "/partidos/crear" },
			{ label: "Crear partido con metadata IPFS", href: "/partidos/crear-ipfs" },
			{ label: "Finalizar partido", href: "/partidos/finalizar" }
		]
	},
	{
		title: "Alineaciones y Eventos",
		items: [
			{ label: "Agregar jugador a alineación", href: "/alineaciones/agregar" },
			{ label: "Registrar salida de jugador", href: "/alineaciones/salida" },
			{ label: "Registrar evento básico", href: "/eventos/registrar" },
			{ label: "Registrar evento con evidencia IPFS", href: "/eventos/registrar-ipfs" },
			{ label: "Evento + reputación", href: "/eventos/registrar-reputacion" }
		]
	},
	{
		title: "Roles y Attestations",
		items: [
			{ label: "Asignar rol a usuario", href: "/roles/asignar" },
			{ label: "Verificar si usuario tiene rol", href: "/roles/verificar" },
			{ label: "Crear attestation", href: "/attestations/crear" },
			{ label: "Elevar verificación", href: "/attestations/elevar" }
		]
	},
	{
		title: "Consultas",
		items: [
			{ label: "Obtener liga", href: "/lecturas/liga" },
			{ label: "Obtener club", href: "/lecturas/club" },
			{ label: "Obtener jugador", href: "/lecturas/jugador" },
			{ label: "Obtener partido", href: "/lecturas/partido" },
			{ label: "Obtener alineación", href: "/lecturas/alineacion" },
			{ label: "Obtener evento", href: "/lecturas/evento" }
		]
	}
];

function ActiveLink({ href, children }: { href: string; children: React.ReactNode }) {
	const pathname = usePathname();
	const active = pathname === href;
	return (
		<Link href={href} className={clsx("nav-link", active && "nav-link-active") }>
			{children}
		</Link>
	);
}

export default function Navbar() {
	const [open, setOpen] = useState(false);
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	const { address } = useAccount();
	const chainId = useChainId();
	const { switchChain, isPending: switching } = useSwitchChain();
	const { data: bal } = useBalance({ address, query: { enabled: !!address } });

	return (
		<header className="navbar">
			<div className="navbar-inner">
				<Link href="/" className="navbar-brand">
					Futuro Fútbol · Avalanche
				</Link>

				{/* Desktop */}
				<nav className="nav-desktop nav-sections">
					{SECTIONS.map((s) => (
						<div key={s.title} className="group nav-item">
							<button className="nav-btn">
								{s.title}
							</button>
							<div className="nav-dropdown">
								{s.items.map((it) => (
									<ActiveLink key={it.href} href={it.href}>
										{it.label}
									</ActiveLink>
								))}
							</div>
						</div>
					))}
				</nav>

				<div className="nav-desktop nav-actions">
					<span className={clsx("pill", chainId === avalancheFuji.id ? "pill-ok" : "pill-warn")}>Red: {mounted ? (chainId ?? "-") : "-"}</span>
					<span className="pill">{mounted && address && bal?.value != null ? (Number(bal.value) / 1e18).toFixed(4) : "-"} AVAX</span>
					<button
						className="btn-secondary"
						onClick={async () => {
							if (address) {
								switchChain({ chainId: avalancheFuji.id });
								return;
							}
							try {
								// Fallback directo a la wallet si no hay conector activo
								// @ts-ignore
								const eth = typeof window !== 'undefined' ? (window as any).ethereum : undefined;
								if (eth?.request) {
									await eth.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0xa869' }] });
								}
							} catch (e) {
								// ignore
							}
						}}
						disabled={!mounted || chainId === avalancheFuji.id || switching}
						aria-hidden={!mounted || chainId === avalancheFuji.id}
					>
						{switching ? "Cambiando…" : "Cambiar a Fuji"}
					</button>
					<a className="btn-secondary" href="https://core.app/tools/testnet-faucet?token=c&subnet=c" target="_blank" rel="noreferrer">Faucet AVAX</a>
				</div>

				{/* Mobile */}
				<button
					onClick={() => setOpen(!open)}
					className="nav-burger nav-mobile-toggle"
					aria-label="Abrir menú"
				>
					☰
				</button>
			</div>

			{/* Mobile drawer */}
			{open && (
				<div className="nav-mobile">
					{SECTIONS.map((s) => (
						<details key={s.title} className="border-t">
							<summary className="nav-mobile-summary">
								{s.title}
							</summary>
							<div className="nav-mobile-list">
								{s.items.map((it) => (
									<ActiveLink key={it.href} href={it.href}>
										{it.label}
									</ActiveLink>
								))}
							</div>
						</details>
					))}
				</div>
			)}
		</header>
	);
}


