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
	return (
		<main className="space-y-4 content-narrow">
			<h1 className="text-2xl font-bold">Consulta: Jugador</h1>
			<div className="row">
				<input className="input" placeholder="ID Jugador" value={id} onChange={(e) => setId(e.target.value)} />
				<button className="btn" onClick={() => refetch()} disabled={!id || isFetching}>Buscar</button>
			</div>
			{data ? (
				<DetailList
					items={[
						{ label: "ID", value: (data as any).id },
						{ label: "Cuenta", value: (data as any).account },
						{ label: "Apodo", value: (data as any).nickname },
						{ label: "Posición", value: (data as any).primaryPosition },
						{ label: "Nivel", value: (data as any).level },
						{ label: "Menor", value: (data as any).isMinor },
						{ label: "Tutor", value: (data as any).guardian },
						{ label: "Visibilidad", value: (data as any).visibility },
						{ label: "Club ID", value: (data as any).clubId }
					]}
				/>
			) : (
				<p className="text-sm" style={{ color: "#aab1c5" }}>Ingresa un ID y presiona Buscar.</p>
			)}
		</main>
	);
}


