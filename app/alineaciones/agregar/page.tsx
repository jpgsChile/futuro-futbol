"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACTS } from "@/lib/contracts";

const FFLineupAbi = [
	{ type: "function", name: "addToLineup", stateMutability: "nonpayable", inputs: [
		{ name: "gameId", type: "uint256" }, { name: "clubId", type: "uint256" }, { name: "playerId", type: "uint256" }
	], outputs: [] }
] as const;

export default function Page() {
	const [gameId, setGameId] = useState("");
	const [clubId, setClubId] = useState("");
	const [playerId, setPlayerId] = useState("");
	const { writeContract, data: hash, isPending, error } = useWriteContract();
	const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });
	return (
		<main className="space-y-4">
			<h1 className="text-2xl font-bold">Agregar a alineación</h1>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					writeContract({ address: CONTRACTS.FFLineup as `0x${string}`, abi: FFLineupAbi, functionName: "addToLineup", args: [BigInt(gameId || "0"), BigInt(clubId || "0"), BigInt(playerId || "0")] });
				}}
				className="max-w-xl space-y-3 rounded-2xl bg-white p-5 shadow"
			>
				<div className="row">
					<input className="input" placeholder="Game ID" value={gameId} onChange={(e) => setGameId(e.target.value)} />
					<input className="input" placeholder="Club ID" value={clubId} onChange={(e) => setClubId(e.target.value)} />
					<input className="input" placeholder="Player ID" value={playerId} onChange={(e) => setPlayerId(e.target.value)} />
				</div>
				<button className="btn" disabled={isPending || isLoading}>{isPending ? "Firmando…" : isLoading ? "Enviando…" : isSuccess ? "Agregado" : "Agregar"}</button>
				{hash ? <p className="text-xs">Tx: <a className="button" href={`https://testnet.snowtrace.io/tx/${hash}`} target="_blank">ver</a></p> : null}
				{error ? <p className="text-red-500 text-xs">{String(error.message || error)}</p> : null}
			</form>
		</main>
	);
}


