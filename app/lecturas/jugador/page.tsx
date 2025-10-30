"use client";

import { useState } from "react";
import { useReadContract } from "wagmi";
import { CONTRACTS } from "@/lib/contracts";
import DetailList from "@/components/DetailList";
import { FFViewsAbi } from "@/abi/FFViews";

export default function Page() {
	const [id, setId] = useState("");
	const { data, refetch, isFetching } = useReadContract({
		address: CONTRACTS.FFViews as `0x${string}`,
		abi: FFViewsAbi,
		functionName: "getJugador",
		args: id ? [BigInt(id)] : undefined
	});

	// Mapeo de posiciones para mostrar nombres amigables
	const POSITIONS = [
		"Portero",
		"Lateral derecho",
		"Defensa central",
		"Lateral izquierdo",
		"Carrilero derecho",
		"Carrilero izquierdo",
		"Pivote / Mediocentro defensivo",
		"Mediocentro",
		"Mediapunta",
		"Extremo derecho",
		"Extremo izquierdo",
		"Delantero centro",
		"Segundo delantero"
	];
	return (
		<main className="space-y-4 content-narrow">
			<h1 className="text-2xl font-bold">Consulta: Jugador</h1>
			<div className="row">
				<input className="input" placeholder="ID Jugador" value={id} onChange={(e) => setId(e.target.value)} />
				<button className="btn" onClick={() => refetch()} disabled={!id || isFetching}>Buscar</button>
			</div>
			{data ? (() => {
				const p = data as any;
				const posIndex = Number(p.primaryPosition ?? 0);
				return (
					<DetailList
						items={[
							{ label: "ID", value: p.id },
							{ label: "Cuenta", value: p.account },
							{ label: "Nombre completo", value: "-" },
							{ label: "Apodo", value: p.nickname },
							{ label: "Posición principal", value: POSITIONS[posIndex] ?? posIndex },
							{ label: "Posición secundaria", value: "-" },
							{ label: "Posición terciaria", value: "-" },
							{ label: "Nivel", value: p.level },
							{ label: "Menor", value: p.isMinor },
							{ label: "Tutor", value: p.guardian },
							{ label: "Visibilidad", value: Number(p.visibility) === 0 ? "Público" : "Restringido" },
							{ label: "Club ID", value: p.clubId }
						]}
					/>
				);
			})() : (
				<p className="text-sm" style={{ color: "#aab1c5" }}>Ingresa un ID y presiona Buscar.</p>
			)}
		</main>
	);
}


