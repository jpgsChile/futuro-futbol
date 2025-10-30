"use client";

import { useMemo, useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { FFPlayerAbi } from "@/abi/FFPlayer";
import { CONTRACTS } from "@/lib/contracts";

export default function Page() {
	const POSITIONS = useMemo(
		() => [
			"Portero",
			"Lateral derecho",
			"Defensa central",
			"Lateral izquierdo",
			"Carrilero derecho",
			"Carrilero izquierdo",
			"Pivote / Mediocentro defensivo",
			"Mediocentro",
			"Mediapunta",
			"Extremo derecho",
			"Extremo izquierdo",
			"Delantero centro",
			"Segundo delantero"
		],
		[]
	);
	const [nickname, setNickname] = useState("");
	const [fullName, setFullName] = useState("");
	const [primaryPosition, setPrimaryPosition] = useState("0");
	const [secondaryPosition, setSecondaryPosition] = useState("");
	const [tertiaryPosition, setTertiaryPosition] = useState("");
	const [level, setLevel] = useState("5");
	const [isMinor, setIsMinor] = useState(false);
	const [guardian, setGuardian] = useState<`0x${string}` | "">("");
	const [visibility, setVisibility] = useState("0");
	const { writeContract, data: hash, isPending, error } = useWriteContract();
	const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

return (
	<main className="space-y-4 content-narrow">
			<h1 className="text-2xl font-bold">Registrar jugador</h1>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					writeContract({
						address: CONTRACTS.FFPlayer as `0x${string}`,
						abi: FFPlayerAbi,
						functionName: "registerPlayerFF",
						args: [
							fullName,
							nickname,
							Number(primaryPosition),
							Number(secondaryPosition || "0"),
							Number(tertiaryPosition || "0"),
							Number(level),
							isMinor,
							(guardian || "0x0000000000000000000000000000000000000000") as `0x${string}`,
							Number(visibility)
						]
					});
				}}
			className="card form"
			>
				<div>
					<label className="block text-sm font-medium">Nombre completo</label>
					<input className="input" placeholder="Nombre y Apellido" value={fullName} onChange={(e) => setFullName(e.target.value)} />
				</div>
				<div>
					<label className="block text-sm font-medium">Apodo</label>
					<input className="input" value={nickname} onChange={(e) => setNickname(e.target.value)} />
				</div>
				<div>
					<label className="block text-sm font-medium">Posición principal</label>
					<select className="select" value={primaryPosition} onChange={(e) => setPrimaryPosition(e.target.value)}>
						{POSITIONS.map((p, idx) => (
							<option key={p} value={String(idx)}>{p}</option>
						))}
					</select>
				</div>
			<div className="form-row">
					<div style={{ flex: 1 }}>
						<label className="block text-sm font-medium">Posición secundaria</label>
						<select className="select" value={secondaryPosition} onChange={(e) => setSecondaryPosition(e.target.value)}>
							<option value="">(opcional)</option>
							{POSITIONS.map((p, idx) => (
								<option key={p} value={String(idx)}>{p}</option>
							))}
						</select>
					</div>
					<div style={{ flex: 1 }}>
						<label className="block text-sm font-medium">Posición terciaria</label>
						<select className="select" value={tertiaryPosition} onChange={(e) => setTertiaryPosition(e.target.value)}>
							<option value="">(opcional)</option>
							{POSITIONS.map((p, idx) => (
								<option key={p} value={String(idx)}>{p}</option>
							))}
						</select>
					</div>
				</div>
				<div>
					<label className="block text-sm font-medium">Nivel (1-10)</label>
					<input className="input" value={level} onChange={(e) => setLevel(e.target.value)} />
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
			<div className="form-actions">
				<button className="btn" disabled={isPending || isLoading}>{isPending ? "Firmando…" : isLoading ? "Enviando…" : isSuccess ? "Registrado" : "Registrar"}</button>
				{hash ? <a className="btn-secondary" href={`https://testnet.snowtrace.io/tx/${hash}`} target="_blank">Ver tx</a> : null}
			</div>
				{error ? <p className="text-red-500 text-xs">{String(error.message || error)}</p> : null}
			</form>
		</main>
	);
}


