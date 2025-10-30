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
		functionName: "getLiga",
		args: id ? [BigInt(id)] : undefined
	});
	return (
		<main className="space-y-4 content-narrow">
			<h1 className="text-2xl font-bold">Consulta: Liga</h1>
			<div className="row">
				<input className="input" placeholder="ID Liga" value={id} onChange={(e) => setId(e.target.value)} />
				<button className="btn" onClick={() => refetch()} disabled={!id || isFetching}>Buscar</button>
			</div>
			{data ? (
				<DetailList
					items={[
						{ label: "ID", value: (data as any).id },
						{ label: "Nombre", value: (data as any).name },
						{ label: "Ubicación", value: (data as any).location },
						{ label: "Categoría", value: (data as any).category },
						{ label: "Propietario", value: (data as any).owner },
						{ label: "Nivel Verificación", value: (data as any).verificationLevel }
					]}
				/>
			) : (
				<p className="text-sm" style={{ color: "#aab1c5" }}>Ingresa un ID y presiona Buscar.</p>
			)}
		</main>
	);
}


