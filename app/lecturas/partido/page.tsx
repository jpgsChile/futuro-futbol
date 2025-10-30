"use client";

import { useState } from "react";
import { useReadContract } from "wagmi";
import { CONTRACTS } from "@/lib/contracts";
import DetailList, { toDisplay } from "@/components/DetailList";
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
		<main className="space-y-4 content-narrow">
			<h1 className="text-2xl font-bold">Consulta: Partido</h1>
			<div className="row">
				<input className="input" placeholder="ID Partido" value={id} onChange={(e) => setId(e.target.value)} />
				<button className="btn" onClick={() => refetch()} disabled={!id || isFetching}>Buscar</button>
			</div>
			{data ? (
				<DetailList
					items={[
						{ label: "ID", value: (data as any).id },
						{ label: "Club A", value: (data as any).clubAId },
						{ label: "Club B", value: (data as any).clubBId },
						{ label: "Programado", value: (data as any).scheduledAt },
						{ label: "CID", value: (data as any).metadataCid },
						{ label: "Cerrado", value: (data as any).closed }
					]}
				/>
			) : (
				<p className="text-sm" style={{ color: "#aab1c5" }}>Ingresa un ID y presiona Buscar.</p>
			)}
		</main>
	);
}


