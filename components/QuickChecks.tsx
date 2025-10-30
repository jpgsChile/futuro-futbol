"use client";

import { useAccount, useChainId, useReadContract } from "wagmi";
import { CONTRACTS } from "@/lib/contracts";
import { FFRolesAbi } from "@/abi/FFRoles";

export default function QuickChecks() {
	const { address, isConnected } = useAccount();
	const chainId = useChainId();

	const { data: leagueRole } = useReadContract({
		address: CONTRACTS.FFRoles as `0x${string}`,
		abi: FFRolesAbi,
		functionName: "LEAGUE_ROLE"
	});

	const { data: hasLeague } = useReadContract({
		address: CONTRACTS.FFRoles as `0x${string}`,
		abi: FFRolesAbi,
		functionName: "hasRole",
		args: (leagueRole && address ? [leagueRole as `0x${string}`, address] : undefined) as
			| readonly [`0x${string}`, `0x${string}`]
			| undefined
	});

	return (
		<div className="card">
			<h3>Estado rápido</h3>
			<ul style={{ margin: 0, paddingLeft: 16 }}>
				<li>Conexión: {isConnected ? "Conectado" : "Desconectado"}</li>
				<li>Red: {chainId ?? "-"} (esperado: 43113 Fuji)</li>
				<li>Direcciones cargadas: {Object.values(CONTRACTS).every((a) => a !== "0x0000000000000000000000000000000000000000") ? "OK" : "Faltan"}</li>
				<li>Permiso para crear liga: {hasLeague ? "Sí" : "No"}</li>
			</ul>
		</div>
	);
}


