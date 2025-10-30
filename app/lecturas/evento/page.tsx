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
		functionName: "getEvento",
		args: id ? [BigInt(id)] : undefined
	});
	return (
		<main className="space-y-4 content-narrow">
			<h1 className="text-2xl font-bold">Consulta: Evento</h1>
			<div className="row">
				<input className="input" placeholder="ID Evento" value={id} onChange={(e) => setId(e.target.value)} />
				<button className="btn" onClick={() => refetch()} disabled={!id || isFetching}>Buscar</button>
			</div>
			{data ? (
				<DetailList
					items={[
						{ label: "ID", value: (data as any).id },
						{ label: "Partido ID", value: (data as any).gameId },
						{ label: "Club ID", value: (data as any).clubId },
						{ label: "Jugador ID", value: (data as any).playerId },
						{ label: "Tipo", value: (data as any).eventType },
						{ label: "CID", value: (data as any).dataCid },
						{ label: "Timestamp", value: (data as any).timestamp }
					]}
				/>
			) : (
				<p className="text-sm" style={{ color: "#aab1c5" }}>Ingresa un ID y presiona Buscar.</p>
			)}
		</main>
	);
}


