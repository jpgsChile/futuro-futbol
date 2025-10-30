"use client";

import { useMemo, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { CONTRACTS } from "@/lib/contracts";
import { FFRolesAbi } from "@/abi/FFRoles";

type RoleKey = "LEAGUE_ROLE" | "CLUB_ROLE" | "REFEREE_ROLE" | "VERIFIER_ROLE" | "GUARDIAN_ROLE" | "DEFAULT_ADMIN_ROLE";

export default function VerificarRolPage() {
	const { address: my } = useAccount();
	const [account, setAccount] = useState<`0x${string}` | "">("");
	const [roleKey, setRoleKey] = useState<RoleKey>("LEAGUE_ROLE");

	const { data: leagueRole } = useReadContract({ address: CONTRACTS.FFRoles as `0x${string}`, abi: FFRolesAbi, functionName: "LEAGUE_ROLE" });
	const { data: clubRole } = useReadContract({ address: CONTRACTS.FFRoles as `0x${string}`, abi: FFRolesAbi, functionName: "CLUB_ROLE" });
	const { data: refereeRole } = useReadContract({ address: CONTRACTS.FFRoles as `0x${string}`, abi: FFRolesAbi, functionName: "REFEREE_ROLE" });
	const { data: verifierRole } = useReadContract({ address: CONTRACTS.FFRoles as `0x${string}`, abi: FFRolesAbi, functionName: "VERIFIER_ROLE" });
	const { data: guardianRole } = useReadContract({ address: CONTRACTS.FFRoles as `0x${string}`, abi: FFRolesAbi, functionName: "GUARDIAN_ROLE" });
	const { data: adminRole } = useReadContract({ address: CONTRACTS.FFRoles as `0x${string}`, abi: FFRolesAbi, functionName: "DEFAULT_ADMIN_ROLE" });

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
			case "DEFAULT_ADMIN_ROLE":
				return adminRole as `0x${string}` | undefined;
		}
	}, [roleKey, leagueRole, clubRole, refereeRole, verifierRole, guardianRole, adminRole]);

	const { data: result } = useReadContract({
		address: CONTRACTS.FFRoles as `0x${string}`,
		abi: FFRolesAbi,
		functionName: "hasRole",
		args: (roleBytes && (account || my) ? [roleBytes as `0x${string}`, (account || my)!] : undefined) as | readonly [`0x${string}`, `0x${string}`] | undefined
	});

return (
	<main className="space-y-4 content-narrow">
			<h1 className="text-2xl font-bold">Verificar rol</h1>
		<div className="card form">
				<div>
					<label className="block text-sm font-medium">Cuenta</label>
					<input className="input" placeholder="0x... (vacío usa mi cuenta)" value={account} onChange={(e) => setAccount(e.target.value as `0x${string}`)} />
				</div>
				<div>
					<label className="block text-sm font-medium">Rol</label>
					<select className="select" value={roleKey} onChange={(e) => setRoleKey(e.target.value as RoleKey)}>
						<option value="LEAGUE_ROLE">LEAGUE_ROLE</option>
						<option value="CLUB_ROLE">CLUB_ROLE</option>
						<option value="REFEREE_ROLE">REFEREE_ROLE</option>
						<option value="VERIFIER_ROLE">VERIFIER_ROLE</option>
						<option value="GUARDIAN_ROLE">GUARDIAN_ROLE</option>
						<option value="DEFAULT_ADMIN_ROLE">DEFAULT_ADMIN_ROLE</option>
					</select>
				</div>
				<p>Resultado: {result ? "Sí" : "No"}</p>
			</div>
		</main>
	);
}


