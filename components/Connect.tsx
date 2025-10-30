"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Connect() {
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);
	const { isConnected, address } = useAccount();
	const { connectors, connect, isPending, error } = useConnect();
	const { disconnect } = useDisconnect();

	if (!mounted) {
		return (
			<div className="row">
				<button className="button" disabled>
					Conectar
				</button>
			</div>
		);
	}

	if (isConnected) {
		return (
			<div className="row">
				<button className="button" onClick={() => disconnect()}>
					Desconectar {address?.slice(0, 6)}…{address?.slice(-4)}
				</button>
			</div>
		);
	}

	return (
		<div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
			{connectors.map((c) => (
				<button
					key={c.uid}
					className="button"
					onClick={() => connect({ connector: c })}
					disabled={!c.ready || isPending}
					title={!c.ready ? "Conector no disponible" : c.name}
				>
					Conectar {c.name}
				</button>
			))}
			<ConnectButton />
			{error ? <span style={{ color: "#f66", fontSize: 12 }}>{String(error.message || error)}</span> : null}
		</div>
	);
}
