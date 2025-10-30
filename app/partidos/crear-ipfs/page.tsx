"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { FFGameAbi } from "@/abi/FFGame";
import { CONTRACTS } from "@/lib/contracts";
import { uploadToIPFS } from "@/lib/ipfs";

export default function Page() {
	const [clubAId, setClubA] = useState("");
	const [clubBId, setClubB] = useState("");
	const [scheduledAt, setScheduledAt] = useState("");
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
			<h1 className="text-2xl font-bold">Crear partido con IPFS</h1>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					const uri = await ensureCid();
					writeContract({ address: CONTRACTS.FFGame as `0x${string}`, abi: FFGameAbi, functionName: "createGameFF", args: [BigInt(clubAId || "0"), BigInt(clubBId || "0"), BigInt(scheduledAt || "0"), uri] });
				}}
				className="max-w-xl space-y-3 rounded-2xl bg-white p-5 shadow"
			>
				<div className="row">
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
				<div>
					<label className="block text-sm font-medium">Archivo evidencia (opcional)</label>
					<input className="input" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
				</div>
				<div>
					<label className="block text-sm font-medium">CID/IPFS URI (opcional)</label>
					<input className="input" placeholder="ipfs://..." value={cid} onChange={(e) => setCid(e.target.value)} />
				</div>
				<button className="btn" disabled={isPending || isLoading || uploading}>{uploading ? "Subiendo…" : isPending ? "Firmando…" : isLoading ? "Enviando…" : isSuccess ? "Creado" : "Crear"}</button>
				{hash ? <p className="text-xs">Tx: <a className="button" href={`https://testnet.snowtrace.io/tx/${hash}`} target="_blank">ver</a></p> : null}
				{error ? <p className="text-red-500 text-xs">{String(error.message || error)}</p> : null}
			</form>
		</main>
	);
}


