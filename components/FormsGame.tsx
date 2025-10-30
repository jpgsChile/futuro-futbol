"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { FFGameAbi } from "@/abi/FFGame";
import { FFEventAbi } from "@/abi/FFEvent";
import { CONTRACTS } from "@/lib/contracts";

export default function FormsGame() {
	return (
		<div className="card">
			<h3>Partidos y Eventos</h3>
			<CreateGameForm />
			<hr />
			<RegisterEventForm />
		</div>
	);
}

function CreateGameForm() {
	const { writeContract, data: hash, isPending } = useWriteContract();
	const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });
	const [clubAId, setClubA] = useState("");
	const [clubBId, setClubB] = useState("");
	const [scheduledAt, setScheduledAt] = useState("");
	const [cid, setCid] = useState("");
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				writeContract({
					address: CONTRACTS.FFGame as `0x${string}`,
					abi: FFGameAbi,
					functionName: "createGameFF",
					args: [BigInt(clubAId || "0"), BigInt(clubBId || "0"), BigInt(scheduledAt || "0"), cid]
				});
			}}
		>
			<label className="label">Crear Partido (con IPFS CID)</label>
			<input className="input" placeholder="Club A ID" value={clubAId} onChange={(e) => setClubA(e.target.value)} />
			<div style={{ height: 8 }} />
			<input className="input" placeholder="Club B ID" value={clubBId} onChange={(e) => setClubB(e.target.value)} />
			<div style={{ height: 8 }} />
			<input className="input" placeholder="Unix time (segundos)" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
			<div style={{ height: 8 }} />
			<input className="input" placeholder="Metadata CID (ipfs://...)" value={cid} onChange={(e) => setCid(e.target.value)} />
			<div style={{ height: 8 }} />
			<button className="button" disabled={isPending || isLoading}>
				{isPending ? "Firmando…" : isLoading ? "Enviando…" : isSuccess ? "Creado" : "Crear Partido"}
			</button>
		</form>
	);
}

function RegisterEventForm() {
	const { writeContract, data: hash, isPending } = useWriteContract();
	const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });
	const [gameId, setGameId] = useState("");
	const [clubId, setClubId] = useState("");
	const [playerId, setPlayerId] = useState("");
	const [eventType, setEventType] = useState("4");
	const [cid, setCid] = useState("");
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				writeContract({
					address: CONTRACTS.FFEvent as `0x${string}`,
					abi: FFEventAbi,
					functionName: "registerEventFF",
					args: [BigInt(gameId || "0"), BigInt(clubId || "0"), BigInt(playerId || "0"), Number(eventType), cid]
				});
			}}
		>
			<label className="label">Registrar Evento (con IPFS CID)</label>
			<input className="input" placeholder="Game ID" value={gameId} onChange={(e) => setGameId(e.target.value)} />
			<div style={{ height: 8 }} />
			<input className="input" placeholder="Club ID" value={clubId} onChange={(e) => setClubId(e.target.value)} />
			<div style={{ height: 8 }} />
			<input className="input" placeholder="Player ID (0 si ninguno)" value={playerId} onChange={(e) => setPlayerId(e.target.value)} />
			<div style={{ height: 8 }} />
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
			<div style={{ height: 8 }} />
			<input className="input" placeholder="Metadata CID (ipfs://...)" value={cid} onChange={(e) => setCid(e.target.value)} />
			<div style={{ height: 8 }} />
			<button className="button" disabled={isPending || isLoading}>
				{isPending ? "Firmando…" : isLoading ? "Enviando…" : isSuccess ? "Registrado" : "Registrar Evento"}
			</button>
		</form>
	);
}
