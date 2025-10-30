"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACTS } from "@/lib/contracts";
import { FFPlayerAbi } from "@/abi/FFPlayer";

export default function Page() {
	const [playerId, setPlayerId] = useState("");
	const [clubId, setClubId] = useState("");
	const { writeContract, data: hash, isPending, error } = useWriteContract();
	const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });
	return (
		<main className="space-y-4">
			<h1 className="text-2xl font-bold">Unir jugador a club</h1>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					writeContract({ address: CONTRACTS.FFPlayer as `0x${string}`, abi: FFPlayerAbi, functionName: "playerJoinClub", args: [BigInt(playerId || "0"), BigInt(clubId || "0")] });
				}}
				className="max-w-xl space-y-3 rounded-2xl bg-white p-5 shadow"
			>
				<div className="row">
					<div style={{ flex: 1 }}>
						<label className="block text-sm font-medium">ID Jugador</label>
						<input className="input" value={playerId} onChange={(e) => setPlayerId(e.target.value)} />
					</div>
					<div style={{ flex: 1 }}>
						<label className="block text-sm font-medium">ID Club</label>
						<input className="input" value={clubId} onChange={(e) => setClubId(e.target.value)} />
					</div>
				</div>
				<button className="btn" disabled={isPending || isLoading}>{isPending ? "Firmando…" : isLoading ? "Enviando…" : isSuccess ? "Unido" : "Unir"}</button>
				{hash ? <p className="text-xs">Tx: <a className="button" href={`https://testnet.snowtrace.io/tx/${hash}`} target="_blank">ver</a></p> : null}
				{error ? <p className="text-red-500 text-xs">{String(error.message || error)}</p> : null}
			</form>
		</main>
	);
}


