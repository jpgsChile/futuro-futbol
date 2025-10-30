"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACTS } from "@/lib/contracts";
import { FFEventAbi } from "@/abi/FFEvent";

const ExtendedAbi = [
	...FFEventAbi,
	{ type: "function", name: "registerEventAndReputation", stateMutability: "nonpayable", inputs: [
		{ name: "gameId", type: "uint256" }, { name: "clubId", type: "uint256" }, { name: "playerId", type: "uint256" }, { name: "eventType", type: "uint8" }, { name: "reputationDelta", type: "int256" }, { name: "dataCid", type: "string" }
	], outputs: [{ name: "", type: "uint256" }] }
] as const;

export default function Page() {
	const [gameId, setGameId] = useState("");
	const [clubId, setClubId] = useState("");
	const [playerId, setPlayerId] = useState("");
	const [eventType, setEventType] = useState("3");
	const [delta, setDelta] = useState("1");
	const [cid, setCid] = useState("");
	const { writeContract, data: hash, isPending, error } = useWriteContract();
	const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });
return (
	<main className="space-y-4 content-narrow">
			<h1 className="text-2xl font-bold">Evento + reputación</h1>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					writeContract({ address: CONTRACTS.FFEvent as `0x${string}`, abi: ExtendedAbi, functionName: "registerEventAndReputation", args: [BigInt(gameId || "0"), BigInt(clubId || "0"), BigInt(playerId || "0"), Number(eventType), BigInt(delta || "0"), cid] });
				}}
			className="card form"
			>
			<div className="form-row">
					<input className="input" placeholder="Game ID" value={gameId} onChange={(e) => setGameId(e.target.value)} />
					<input className="input" placeholder="Club ID" value={clubId} onChange={(e) => setClubId(e.target.value)} />
					<input className="input" placeholder="Player ID" value={playerId} onChange={(e) => setPlayerId(e.target.value)} />
				</div>
			<div className="form-row">
					<select className="select" value={eventType} onChange={(e) => setEventType(e.target.value)}>
						<option value="1">Start</option>
						<option value="2">End</option>
						<option value="3">Goal</option>
						<option value="4">Foul</option>
						<option value="5">Offside</option>
						<option value="6">YellowCard</option>
						<option value="7">RedCard</option>
						<option value="8">Substitution</option>
					</select>
					<input className="input" placeholder="Δ reputación (int)" value={delta} onChange={(e) => setDelta(e.target.value)} />
				</div>
				<div>
					<label className="block text-sm font-medium">CID/IPFS URI (opcional)</label>
					<input className="input" placeholder="ipfs://..." value={cid} onChange={(e) => setCid(e.target.value)} />
				</div>
			<div className="form-actions">
				<button className="btn" disabled={isPending || isLoading}>{isPending ? "Firmando…" : isLoading ? "Enviando…" : isSuccess ? "Registrado" : "Registrar"}</button>
				{hash ? <a className="btn-secondary" href={`https://testnet.snowtrace.io/tx/${hash}`} target="_blank">Ver tx</a> : null}
			</div>
				{hash ? <p className="text-xs">Tx: <a className="button" href={`https://testnet.snowtrace.io/tx/${hash}`} target="_blank">ver</a></p> : null}
				{error ? <p className="text-red-500 text-xs">{String(error.message || error)}</p> : null}
			</form>
		</main>
	);
}


