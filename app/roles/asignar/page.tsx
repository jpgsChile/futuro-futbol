"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACTS } from "@/lib/contracts";
import { FFRolesAbi } from "@/abi/FFRoles";

type RoleKey = "LEAGUE_ROLE" | "CLUB_ROLE" | "REFEREE_ROLE" | "VERIFIER_ROLE" | "GUARDIAN_ROLE";

export default function AsignarRolPage() {
	const { address } = useAccount();
	const [target, setTarget] = useState<`0x${string}` | "">("");
	const [roleKey, setRoleKey] = useState<RoleKey>("LEAGUE_ROLE");

	const { data: adminRole } = useReadContract({
		address: CONTRACTS.FFRoles as `0x${string}`,
		abi: FFRolesAbi,
		functionName: "DEFAULT_ADMIN_ROLE"
	});
	const { data: isAdmin } = useReadContract({
		address: CONTRACTS.FFRoles as `0x${string}`,
		abi: FFRolesAbi,
		functionName: "hasRole",
		args: (adminRole && address ? [adminRole as `0x${string}`, address] : undefined) as | readonly [`0x${string}`, `0x${string}`] | undefined
	});

	const { data: leagueRole } = useReadContract({ address: CONTRACTS.FFRoles as `0x${string}`, abi: FFRolesAbi, functionName: "LEAGUE_ROLE" });
	const { data: clubRole } = useReadContract({ address: CONTRACTS.FFRoles as `0x${string}`, abi: FFRolesAbi, functionName: "CLUB_ROLE" });
	const { data: refereeRole } = useReadContract({ address: CONTRACTS.FFRoles as `0x${string}`, abi: FFRolesAbi, functionName: "REFEREE_ROLE" });
	const { data: verifierRole } = useReadContract({ address: CONTRACTS.FFRoles as `0x${string}`, abi: FFRolesAbi, functionName: "VERIFIER_ROLE" });
	const { data: guardianRole } = useReadContract({ address: CONTRACTS.FFRoles as `0x${string}`, abi: FFRolesAbi, functionName: "GUARDIAN_ROLE" });

	const roleBytes = useMemo(() => {
		switch (roleKey) {
			case "LEAGUE_ROLE":
				return leagueRole as `0x${string}` | undefined;
			case "CLUB_ROLE":
				return clubRole as `0x${string}` | undefined;
			case "REFEREE_ROLE":
				return refereeRole as `0x${string}` | undefined;
			case "VERIFIER_ROLE":
				return verifierRole as `0x${string}` | undefined;
			case "GUARDIAN_ROLE":
				return guardianRole as `0x${string}` | undefined;
		}
	}, [roleKey, leagueRole, clubRole, refereeRole, verifierRole, guardianRole]);

	const { writeContract, data: hash, isPending, error } = useWriteContract();
	const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

return (
	<main className="space-y-4 content-narrow">
			<h1 className="text-2xl font-bold">Asignar rol</h1>
			<p className="text-sm" style={{ color: "#aab1c5" }}>
				Sólo un administrador puede asignar roles. Tu estado: {isAdmin ? "Admin" : "No admin"}.
			</p>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					if (!roleBytes || !target) return;
					writeContract({ address: CONTRACTS.FFRoles as `0x${string}`, abi: FFRolesAbi, functionName: "assignRole", args: [roleBytes, target] });
				}}
			className="card form"
			>
				<div>
					<label className="block text-sm font-medium">Rol</label>
					<select className="select" value={roleKey} onChange={(e) => setRoleKey(e.target.value as RoleKey)}>
						<option value="LEAGUE_ROLE">LEAGUE_ROLE</option>
						<option value="CLUB_ROLE">CLUB_ROLE</option>
						<option value="REFEREE_ROLE">REFEREE_ROLE</option>
						<option value="VERIFIER_ROLE">VERIFIER_ROLE</option>
						<option value="GUARDIAN_ROLE">GUARDIAN_ROLE</option>
					</select>
				</div>
				<div>
					<label className="block text-sm font-medium">Cuenta destino</label>
					<input className="input" placeholder="0x..." value={target} onChange={(e) => setTarget(e.target.value as `0x${string}`)} />
				</div>
			<div className="form-actions">
				<button className="btn" disabled={!roleBytes || !target || isPending || isLoading}>
					{isPending ? "Firmando…" : isLoading ? "Enviando…" : isSuccess ? "Asignado" : "Asignar rol"}
				</button>
			</div>
				{error ? <p className="text-red-500 text-xs">{String(error.message || error)}</p> : null}
			</form>
		</main>
	);
}


