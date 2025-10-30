"use client";

import { useState } from "react";
import { useReadContract } from "wagmi";
import { CONTRACTS } from "@/lib/contracts";
import DetailList from "@/components/DetailList";
import { FFViewsAbi } from "@/abi/FFViews";

export default function Page() {
	const [gameId, setGameId] = useState("");
	const [clubId, setClubId] = useState("");
	const { data, refetch, isFetching } = useReadContract({
		address: CONTRACTS.FFViews as `0x${string}`,
		abi: FFViewsAbi,
		functionName: "getAlineacion",
		args: gameId && clubId ? [BigInt(gameId), BigInt(clubId)] : undefined
	});
	return (
		<main className="space-y-4 content-narrow">
			<h1 className="text-2xl font-bold">Consulta: Alineación</h1>
			<div className="row">
				<input className="input" placeholder="Game ID" value={gameId} onChange={(e) => setGameId(e.target.value)} />
				<input className="input" placeholder="Club ID" value={clubId} onChange={(e) => setClubId(e.target.value)} />
				<button className="btn" onClick={() => refetch()} disabled={!gameId || !clubId || isFetching}>Buscar</button>
			</div>
			{data ? (
				<DetailList items={[{ label: "Jugadores (IDs)", value: data as any }]} />
			) : (
				<p className="text-sm" style={{ color: "#aab1c5" }}>Ingresa IDs y presiona Buscar.</p>
			)}
		</main>
	);
}


