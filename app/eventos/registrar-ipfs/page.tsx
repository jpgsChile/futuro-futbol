"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACTS } from "@/lib/contracts";
import { FFEventAbi } from "@/abi/FFEvent";
import { uploadToIPFS } from "@/lib/ipfs";

export default function Page() {
	const [gameId, setGameId] = useState("");
	const [clubId, setClubId] = useState("");
	const [playerId, setPlayerId] = useState("");
	const [eventType, setEventType] = useState("4");
	const [file, setFile] = useState<File | null>(null);
	const [cid, setCid] = useState("");
	const [uploading, setUploading] = useState(false);
	const { writeContract, data: hash, isPending, error } = useWriteContract();
	const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

	async function ensureCid() {
		if (cid) return cid;
		if (!file) throw new Error("Selecciona un archivo o ingresa un CID");
		setUploading(true);
		try {
			const uri = await uploadToIPFS(file, file.name);
			setCid(uri);
			return uri;
		} finally {
			setUploading(false);
		}
	}

	return (
		<main className="space-y-4">
			<h1 className="text-2xl font-bold">Registrar evento con IPFS</h1>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					const uri = await ensureCid();
					writeContract({ address: CONTRACTS.FFEvent as `0x${string}`, abi: FFEventAbi, functionName: "registerEventFF", args: [BigInt(gameId || "0"), BigInt(clubId || "0"), BigInt(playerId || "0"), Number(eventType), uri] });
				}}
				className="max-w-xl space-y-3 rounded-2xl bg-white p-5 shadow"
			>
				<div className="row">
					<input className="input" placeholder="Game ID" value={gameId} onChange={(e) => setGameId(e.target.value)} />
					<input className="input" placeholder="Club ID" value={clubId} onChange={(e) => setClubId(e.target.value)} />
					<input className="input" placeholder="Player ID (0 si ninguno)" value={playerId} onChange={(e) => setPlayerId(e.target.value)} />
				</div>
				<div>
					<label className="block text-sm font-medium">Tipo de evento</label>
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
				</div>
				<div>
					<label className="block text-sm font-medium">Archivo evidencia (opcional)</label>
					<input className="input" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
				</div>
				<div>
					<label className="block text-sm font-medium">CID/IPFS URI (opcional)</label>
					<input className="input" placeholder="ipfs://..." value={cid} onChange={(e) => setCid(e.target.value)} />
				</div>
				<button className="btn" disabled={isPending || isLoading || uploading}>{uploading ? "Subiendo…" : isPending ? "Firmando…" : isLoading ? "Enviando…" : isSuccess ? "Registrado" : "Registrar"}</button>
				{hash ? <p className="text-xs">Tx: <a className="button" href={`https://testnet.snowtrace.io/tx/${hash}`} target="_blank">ver</a></p> : null}
				{error ? <p className="text-red-500 text-xs">{String(error.message || error)}</p> : null}
			</form>
		</main>
	);
}


