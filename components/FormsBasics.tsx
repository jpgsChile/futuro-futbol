"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { FFLeagueAbi } from "@/abi/FFLeague";
import { FFClubAbi } from "@/abi/FFClub";
import { FFPlayerAbi } from "@/abi/FFPlayer";
import { CONTRACTS } from "@/lib/contracts";

export default function FormsBasics() {
	return (
		<div className="card">
			<h3>Formularios Básicos</h3>
			<CreateLeagueForm />
			<hr />
			<CreateClubForm />
			<hr />
			<RegisterPlayerForm />
		</div>
	);
}

function CreateLeagueForm() {
	const { writeContract, data: hash, isPending } = useWriteContract();
	const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });
	const [name, setName] = useState("");
	const [location, setLocation] = useState("");
	const [category, setCategory] = useState("");
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				writeContract({
					address: CONTRACTS.FFLeague as `0x${string}`,
					abi: FFLeagueAbi,
					functionName: "createLeague",
					args: [name, location, category]
				});
			}}
		>
			<label className="label">Crear Liga</label>
			<input className="input" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
			<div style={{ height: 8 }} />
			<input className="input" placeholder="Ubicación" value={location} onChange={(e) => setLocation(e.target.value)} />
			<div style={{ height: 8 }} />
			<input className="input" placeholder="Categoría" value={category} onChange={(e) => setCategory(e.target.value)} />
			<div style={{ height: 8 }} />
			<button className="button" disabled={isPending || isLoading}>
				{isPending ? "Firmando…" : isLoading ? "Enviando…" : isSuccess ? "Creada" : "Crear Liga"}
			</button>
		</form>
	);
}

function CreateClubForm() {
	const { writeContract, data: hash, isPending } = useWriteContract();
	const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });
	const [leagueId, setLeagueId] = useState("");
	const [name, setName] = useState("");
	const [fixedGK, setFixedGK] = useState(false);
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				writeContract({
					address: CONTRACTS.FFClub as `0x${string}`,
					abi: FFClubAbi,
					functionName: "createClub",
					args: [BigInt(leagueId || "0"), name, fixedGK]
				});
			}}
		>
			<label className="label">Crear Club</label>
			<input className="input" placeholder="ID Liga" value={leagueId} onChange={(e) => setLeagueId(e.target.value)} />
			<div style={{ height: 8 }} />
			<input className="input" placeholder="Nombre Club" value={name} onChange={(e) => setName(e.target.value)} />
			<div style={{ height: 8 }} />
			<div className="row">
				<input id="gk" type="checkbox" checked={fixedGK} onChange={(e) => setFixedGK(e.target.checked)} />
				<label htmlFor="gk">Portero fijo</label>
			</div>
			<div style={{ height: 8 }} />
			<button className="button" disabled={isPending || isLoading}>
				{isPending ? "Firmando…" : isLoading ? "Enviando…" : isSuccess ? "Creado" : "Crear Club"}
			</button>
		</form>
	);
}

function RegisterPlayerForm() {
	const { writeContract, data: hash, isPending } = useWriteContract();
	const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });
	const [nickname, setNickname] = useState("");
	const [primaryPosition, setPrimaryPosition] = useState("0");
	const [level, setLevel] = useState("5");
	const [isMinor, setIsMinor] = useState(false);
	const [guardian, setGuardian] = useState("0x0000000000000000000000000000000000000000");
	const [visibility, setVisibility] = useState("0");
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				writeContract({
					address: CONTRACTS.FFPlayer as `0x${string}`,
					abi: FFPlayerAbi,
					functionName: "registerPlayerFF",
					// Defaults: fullName = nickname; secondary/tertiary = 0
					args: [
						nickname,
						nickname,
						Number(primaryPosition),
						0,
						0,
						Number(level),
						isMinor,
						guardian as `0x${string}`,
						Number(visibility)
					]
				});
			}}
		>
			<label className="label">Registrar Jugador</label>
			<input className="input" placeholder="Apodo" value={nickname} onChange={(e) => setNickname(e.target.value)} />
			<div style={{ height: 8 }} />
			<input className="input" placeholder="Posición primaria (0-10)" value={primaryPosition} onChange={(e) => setPrimaryPosition(e.target.value)} />
			<div style={{ height: 8 }} />
			<input className="input" placeholder="Nivel (1-10)" value={level} onChange={(e) => setLevel(e.target.value)} />
			<div style={{ height: 8 }} />
			<div className="row">
				<input id="minor" type="checkbox" checked={isMinor} onChange={(e) => setIsMinor(e.target.checked)} />
				<label htmlFor="minor">Es menor de edad</label>
			</div>
			<div style={{ height: 8 }} />
			<input className="input" placeholder="Dirección tutor (si aplica)" value={guardian} onChange={(e) => setGuardian(e.target.value)} />
			<div style={{ height: 8 }} />
			<select className="select" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
				<option value="0">Público</option>
				<option value="1">Restringido</option>
			</select>
			<div style={{ height: 8 }} />
			<button className="button" disabled={isPending || isLoading}>
				{isPending ? "Firmando…" : isLoading ? "Enviando…" : isSuccess ? "Registrado" : "Registrar Jugador"}
			</button>
		</form>
	);
}
