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
		<main className="space-y-4">
			<h1 className="text-2xl font-bold">Finalizar partido</h1>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					writeContract({ address: CONTRACTS.FFGame as `0x${string}`, abi: FFGameAbi, functionName: "closeGame", args: [BigInt(gameId || "0")] });
				}}
				className="max-w-xl space-y-3 rounded-2xl bg-white p-5 shadow"
			>
				<div>
					<label className="block text-sm font-medium">Game ID</label>
					<input className="input" value={gameId} onChange={(e) => setGameId(e.target.value)} />
				</div>
				<button className="btn" disabled={isPending || isLoading}>{isPending ? "Firmando…" : isLoading ? "Enviando…" : isSuccess ? "Cerrado" : "Cerrar"}</button>
				{hash ? <p className="text-xs">Tx: <a className="button" href={`https://testnet.snowtrace.io/tx/${hash}`} target="_blank">ver</a></p> : null}
				{error ? <p className="text-red-500 text-xs">{String(error.message || error)}</p> : null}
			</form>
		</main>
	);
}


