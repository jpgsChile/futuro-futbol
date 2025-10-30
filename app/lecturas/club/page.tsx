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
		functionName: "getClub",
		args: id ? [BigInt(id)] : undefined
	});
	return (
		<main className="space-y-4 content-narrow">
			<h1 className="text-2xl font-bold">Consulta: Club</h1>
			<div className="row">
				<input className="input" placeholder="ID Club" value={id} onChange={(e) => setId(e.target.value)} />
				<button className="btn" onClick={() => refetch()} disabled={!id || isFetching}>Buscar</button>
			</div>
			{data ? (
				<DetailList
					items={[
						{ label: "ID", value: (data as any).id },
						{ label: "Liga ID", value: (data as any).leagueId },
						{ label: "Nombre", value: (data as any).name },
						{ label: "Portero Fijo", value: (data as any).fixedGoalkeeper },
						{ label: "Propietario", value: (data as any).owner }
					]}
				/>
			) : (
				<p className="text-sm" style={{ color: "#aab1c5" }}>Ingresa un ID y presiona Buscar.</p>
			)}
		</main>
	);
}


