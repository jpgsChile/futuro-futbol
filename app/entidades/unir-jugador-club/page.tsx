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
	<main className="space-y-4 content-narrow">
			<h1 className="text-2xl font-bold">Unir jugador a club</h1>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					writeContract({ address: CONTRACTS.FFPlayer as `0x${string}`, abi: FFPlayerAbi, functionName: "playerJoinClub", args: [BigInt(playerId || "0"), BigInt(clubId || "0")] });
				}}
			className="card form"
			>
			<div className="form-row">
					<div style={{ flex: 1 }}>
						<label className="block text-sm font-medium">ID Jugador</label>
						<input className="input" value={playerId} onChange={(e) => setPlayerId(e.target.value)} />
					</div>
					<div style={{ flex: 1 }}>
						<label className="block text-sm font-medium">ID Club</label>
						<input className="input" value={clubId} onChange={(e) => setClubId(e.target.value)} />
					</div>
				</div>
			<div className="form-actions">
				<button className="btn" disabled={isPending || isLoading}>{isPending ? "Firmando…" : isLoading ? "Enviando…" : isSuccess ? "Unido" : "Unir"}</button>
				{hash ? <a className="btn-secondary" href={`https://testnet.snowtrace.io/tx/${hash}`} target="_blank">Ver tx</a> : null}
			</div>
				{error ? <p className="text-red-500 text-xs">{String(error.message || error)}</p> : null}
			</form>
		</main>
	);
}


