"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { FFGameAbi } from "@/abi/FFGame";
import { CONTRACTS } from "@/lib/contracts";

export default function Page() {
	const [clubAId, setClubA] = useState("");
	const [clubBId, setClubB] = useState("");
	const [scheduledAt, setScheduledAt] = useState("");
	const { writeContract, data: hash, isPending, error } = useWriteContract();
	const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });
return (
	<main className="space-y-4 content-narrow">
			<h1 className="text-2xl font-bold">Crear partido</h1>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					writeContract({ address: CONTRACTS.FFGame as `0x${string}`, abi: FFGameAbi, functionName: "createGame", args: [BigInt(clubAId || "0"), BigInt(clubBId || "0"), BigInt(scheduledAt || "0")] });
				}}
			className="card form"
			>
			<div className="form-row">
					<div style={{ flex: 1 }}>
						<label className="block text-sm font-medium">Club A ID</label>
						<input className="input" value={clubAId} onChange={(e) => setClubA(e.target.value)} />
					</div>
					<div style={{ flex: 1 }}>
						<label className="block text-sm font-medium">Club B ID</label>
						<input className="input" value={clubBId} onChange={(e) => setClubB(e.target.value)} />
					</div>
				</div>
				<div>
					<label className="block text-sm font-medium">Unix time (segundos)</label>
					<input className="input" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
				</div>
			<div className="form-actions">
				<button className="btn" disabled={isPending || isLoading}>{isPending ? "Firmando…" : isLoading ? "Enviando…" : isSuccess ? "Creado" : "Crear"}</button>
				{hash ? <a className="btn-secondary" href={`https://testnet.snowtrace.io/tx/${hash}`} target="_blank">Ver tx</a> : null}
			</div>
				{error ? <p className="text-red-500 text-xs">{String(error.message || error)}</p> : null}
			</form>
		</main>
	);
}


