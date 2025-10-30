"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACTS } from "@/lib/contracts";
import { FFEventAbi } from "@/abi/FFEvent";

const BasicAbi = [
	{ type: "function", name: "registerEvent", stateMutability: "nonpayable", inputs: [
		{ name: "gameId", type: "uint256" }, { name: "clubId", type: "uint256" }, { name: "playerId", type: "uint256" }, { name: "eventType", type: "uint8" }
	], outputs: [{ name: "", type: "uint256" }] }
] as const;

export default function Page() {
	const [gameId, setGameId] = useState("");
	const [clubId, setClubId] = useState("");
	const [playerId, setPlayerId] = useState("");
	const [eventType, setEventType] = useState("3");
	const { writeContract, data: hash, isPending, error } = useWriteContract();
	const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });
return (
	<main className="space-y-4 content-narrow">
			<h1 className="text-2xl font-bold">Registrar evento</h1>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					writeContract({ address: CONTRACTS.FFEvent as `0x${string}`, abi: BasicAbi, functionName: "registerEvent", args: [BigInt(gameId || "0"), BigInt(clubId || "0"), BigInt(playerId || "0"), Number(eventType)] });
				}}
			className="card form"
			>
			<div className="form-row">
					<input className="input" placeholder="Game ID" value={gameId} onChange={(e) => setGameId(e.target.value)} />
					<input className="input" placeholder="Club ID" value={clubId} onChange={(e) => setClubId(e.target.value)} />
					<input className="input" placeholder="Player ID (0 si ninguno)" value={playerId} onChange={(e) => setPlayerId(e.target.value)} />
				</div>
				<div>
					<label className="block text-sm font-medium">Tipo de evento</label>
					<select className="select" value={eventType} onChange={(e) => setEventType(e.target.value)}>
					<option value="1">Inicio</option>
					<option value="2">Término</option>
					<option value="3">Gol</option>
					<option value="4">Falta</option>
					<option value="5">Fuera de juego</option>
					<option value="6">Tarjeta amarilla</option>
					<option value="7">Tarjeta roja</option>
					<option value="8">Cambio</option>
					</select>
				</div>
			<div className="form-actions">
				<button className="btn" disabled={isPending || isLoading}>{isPending ? "Firmando…" : isLoading ? "Enviando…" : isSuccess ? "Registrado" : "Registrar"}</button>
				{hash ? <a className="btn-secondary" href={`https://testnet.snowtrace.io/tx/${hash}`} target="_blank">Ver tx</a> : null}
			</div>
				{error ? <p className="text-red-500 text-xs">{String(error.message || error)}</p> : null}
			</form>
		</main>
	);
}


