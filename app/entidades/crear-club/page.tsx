"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { FFClubAbi } from "@/abi/FFClub";
import { CONTRACTS } from "@/lib/contracts";

export default function Page() {
	const [leagueId, setLeagueId] = useState("");
	const [name, setName] = useState("");
	const [fixedGK, setFixedGK] = useState(false);
	const { writeContract, data: hash, isPending, error } = useWriteContract();
	const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

	return (
		<main className="space-y-4">
			<h1 className="text-2xl font-bold">Crear club</h1>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					writeContract({ address: CONTRACTS.FFClub as `0x${string}`, abi: FFClubAbi, functionName: "createClub", args: [BigInt(leagueId || "0"), name, fixedGK] });
				}}
				className="max-w-xl space-y-3 rounded-2xl bg-white p-5 shadow"
			>
				<div>
					<label className="block text-sm font-medium">ID Liga</label>
					<input className="input" value={leagueId} onChange={(e) => setLeagueId(e.target.value)} />
				</div>
				<div>
					<label className="block text-sm font-medium">Nombre</label>
					<input className="input" value={name} onChange={(e) => setName(e.target.value)} />
				</div>
				<div className="row">
					<input id="gk" type="checkbox" checked={fixedGK} onChange={(e) => setFixedGK(e.target.checked)} />
					<label htmlFor="gk">Portero fijo</label>
				</div>
				<button className="btn" disabled={isPending || isLoading}>{isPending ? "Firmando…" : isLoading ? "Enviando…" : isSuccess ? "Creado" : "Crear club"}</button>
				{hash ? (
					<p className="text-xs">
						Tx: <a className="button" href={`https://testnet.snowtrace.io/tx/${hash}`} target="_blank">ver en Snowtrace</a>
					</p>
				) : null}
				{error ? <p className="text-red-500 text-xs">{String(error.message || error)}</p> : null}
			</form>
		</main>
	);
}


