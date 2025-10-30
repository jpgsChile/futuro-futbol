"use client";

import { useAccount, useChainId, usePublicClient } from "wagmi";
import { useEffect, useState } from "react";

export default function WalletStatus() {
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);
	const { address, isConnected } = useAccount();
	const chainId = useChainId();
	const client = usePublicClient();
	const [nonce, setNonce] = useState<number | null>(null);

	useEffect(() => {
		let mounted = true;
		(async () => {
			if (isConnected && address && client) {
				const n = await client.getTransactionCount({ address });
				if (mounted) setNonce(Number(n));
			} else {
				if (mounted) setNonce(null);
			}
		})();
		return () => {
			mounted = false;
		};
	}, [isConnected, address, client]);

	return (
		<div className="card">
			<p><strong>Red:</strong> {mounted ? chainId ?? "-" : "-"}</p>
			<p><strong>Cuenta:</strong> {mounted ? address ?? "-" : "-"}</p>
			<p><strong>Nonce:</strong> {mounted ? nonce ?? "-" : "-"}</p>
		</div>
	);
}
