import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import QuickChecks from "@/components/QuickChecks";

const Connect = dynamic(() => import("@/components/Connect"), { ssr: false });

export default function HomePage() {
	return (
		<main className="container">
			<section className="card" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
				<div>
					<div className="row">
						<Image src="/futurofutbol_logo.jpeg" alt="Futuro Fútbol" width={56} height={56} />
						<h1 style={{ margin: 0 }}>Futuro Fútbol</h1>
					</div>
					<p style={{ color: "#aab1c5" }}>
						Gestión de ligas, clubes, jugadores y partidos en Avalanche Fuji con evidencia IPFS, roles y attestations. Transparencia en tiempo real para el fútbol amateur y semiprofesional.
					</p>
					<div className="row">
						<Connect />
						<Link href="/entidades/crear-liga" className="btn">
							Crear liga
						</Link>
					</div>
				</div>
				<ul style={{ margin: 0, paddingLeft: 18 }}>
					<li><strong>Seguridad</strong>: control de roles y protección a menores.</li>
					<li><strong>Evidencia</strong>: metadata IPFS para eventos y partidos.</li>
					<li><strong>Transparencia</strong>: historial completo de eventos y reputación.</li>
					<li><strong>Core Wallet</strong>: firma y conexión nativas en Avalanche.</li>
				</ul>
			</section>

			<section className="grid" style={{ marginTop: 16 }}>
				<div className="card">
					<h3>Empezar rápido</h3>
					<ol style={{ margin: 0, paddingLeft: 18 }}>
						<li>Conecta tu wallet en red Fuji.</li>
						<li>Solicita o asigna el rol adecuado (p. ej. Liga).</li>
						<li>Crea una liga y luego un club.</li>
						<li>Registra jugadores y programa un partido con CID IPFS.</li>
					</ol>
					<div className="row" style={{ marginTop: 12 }}>
						<Link href="/entidades/crear-liga" className="button">Ir a Crear Liga</Link>
						<Link href="/entidades/registrar-jugador" className="button">Registrar Jugador</Link>
					</div>
				</div>
				<div className="card">
					<h3>Diagnóstico de transacciones</h3>
					<ul style={{ margin: 0, paddingLeft: 18 }}>
						<li>Red Fuji (43113) y saldo AVAX suficiente.</li>
						<li>Direcciones de contratos configuradas (lib/contracts.ts).</li>
						<li>Permisos: algunas acciones requieren rol (Liga, Club, Árbitro).</li>
						<li>Core Wallet: acepta la firma cuando se solicite.</li>
					</ul>
					<p style={{ color: "#aab1c5", marginTop: 8 }}>
						Si ves “Not authorized”, debes asignar el rol correspondiente al usuario.
					</p>
				</div>
				<QuickChecks />
			</section>
		</main>
	);
}
