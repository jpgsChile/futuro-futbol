"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { FFPlayerAbi } from "@/abi/FFPlayer";
import { CONTRACTS } from "@/lib/contracts";

export default function Page() {
	const [nickname, setNickname] = useState("");
	const [primaryPosition, setPrimaryPosition] = useState("0");
	const [level, setLevel] = useState("5");
	const [isMinor, setIsMinor] = useState(false);
	const [guardian, setGuardian] = useState<`0x${string}` | "">("");
	const [visibility, setVisibility] = useState("0");
	const { writeContract, data: hash, isPending, error } = useWriteContract();
	const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

	return (
		<main className="space-y-4">
			<h1 className="text-2xl font-bold">Registrar jugador</h1>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					writeContract({
						address: CONTRACTS.FFPlayer as `0x${string}`,
						abi: FFPlayerAbi,
						functionName: "registerPlayerFF",
						args: [nickname, Number(primaryPosition), Number(level), isMinor, (guardian || "0x0000000000000000000000000000000000000000") as `0x${string}`, Number(visibility)]
					});
				}}
				className="max-w-xl space-y-3 rounded-2xl bg-white p-5 shadow"
			>
				<div>
					<label className="block text-sm font-medium">Apodo</label>
					<input className="input" value={nickname} onChange={(e) => setNickname(e.target.value)} />
				</div>
				<div className="row">
					<div style={{ flex: 1 }}>
						<label className="block text-sm font-medium">Posición (0-10)</label>
						<input className="input" value={primaryPosition} onChange={(e) => setPrimaryPosition(e.target.value)} />
					</div>
					<div style={{ flex: 1 }}>
						<label className="block text-sm font-medium">Nivel (1-10)</label>
						<input className="input" value={level} onChange={(e) => setLevel(e.target.value)} />
					</div>
				</div>
				<div className="row">
					<input id="minor" type="checkbox" checked={isMinor} onChange={(e) => setIsMinor(e.target.checked)} />
					<label htmlFor="minor">Es menor de edad</label>
				</div>
				<div>
					<label className="block text-sm font-medium">Tutor (si aplica)</label>
					<input className="input" placeholder="0x..." value={guardian} onChange={(e) => setGuardian(e.target.value as `0x${string}`)} />
				</div>
				<div>
					<label className="block text-sm font-medium">Visibilidad</label>
					<select className="select" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
						<option value="0">Público</option>
						<option value="1">Restringido</option>
					</select>
				</div>
				<button className="btn" disabled={isPending || isLoading}>{isPending ? "Firmando…" : isLoading ? "Enviando…" : isSuccess ? "Registrado" : "Registrar"}</button>
				{hash ? (
					<p className="text-xs">Tx: <a className="button" href={`https://testnet.snowtrace.io/tx/${hash}`} target="_blank">ver en Snowtrace</a></p>
				) : null}
				{error ? <p className="text-red-500 text-xs">{String(error.message || error)}</p> : null}
			</form>
		</main>
	);
}


