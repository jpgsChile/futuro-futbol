"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACTS } from "@/lib/contracts";
import { FFGameAbi } from "@/abi/FFGame";

export default function Page() {
	const [gameId, setGameId] = useState("");
	const { writeContract, data: hash, isPending, error } = useWriteContract();
	const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });
return (
	<main className="space-y-4 content-narrow">
			<h1 className="text-2xl font-bold">Finalizar partido</h1>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					writeContract({ address: CONTRACTS.FFGame as `0x${string}`, abi: FFGameAbi, functionName: "closeGame", args: [BigInt(gameId || "0")] });
				}}
			className="card form"
			>
				<div>
					<label className="block text-sm font-medium">Game ID</label>
					<input className="input" value={gameId} onChange={(e) => setGameId(e.target.value)} />
				</div>
			<div className="form-actions">
				<button className="btn" disabled={isPending || isLoading}>{isPending ? "Firmando…" : isLoading ? "Enviando…" : isSuccess ? "Cerrado" : "Cerrar"}</button>
				{hash ? <a className="btn-secondary" href={`https://testnet.snowtrace.io/tx/${hash}`} target="_blank">Ver tx</a> : null}
			</div>
				{error ? <p className="text-red-500 text-xs">{String(error.message || error)}</p> : null}
			</form>
		</main>
	);
}


