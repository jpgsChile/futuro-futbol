"use client";

import { useState } from "react";
import { useReadContract } from "wagmi";
import { CONTRACTS } from "@/lib/contracts";
import { FFViewsAbi } from "@/abi/FFViews";

export default function Page() {
	const [id, setId] = useState("");
	const { data, refetch, isFetching } = useReadContract({
		address: CONTRACTS.FFViews as `0x${string}`,
		abi: FFViewsAbi,
		functionName: "getJuego",
		args: id ? [BigInt(id)] : undefined
	});
	return (
		<main className="space-y-4">
			<h1 className="text-2xl font-bold">Consulta: Partido</h1>
			<div className="row">
				<input className="input" placeholder="ID Partido" value={id} onChange={(e) => setId(e.target.value)} />
				<button className="btn" onClick={() => refetch()} disabled={!id || isFetching}>Buscar</button>
			</div>
			{data ? <pre className="card" style={{ overflow: "auto" }}>{JSON.stringify(data, null, 2)}</pre> : <p className="text-sm" style={{ color: "#aab1c5" }}>Ingresa un ID y presiona Buscar.</p>}
		</main>
	);
}


