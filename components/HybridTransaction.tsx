"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ReactNode } from "react";

export function HybridTransaction({
	address,
	abi,
	functionName,
	args,
	children
}: {
	address: `0x${string}`;
	abi: readonly any[];
	functionName: string;
	args?: readonly unknown[];
	children?: ReactNode;
}) {
	const { writeContract, data: hash, isPending, error } = useWriteContract();
	const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

	return (
		<div className="card">
			<button
				className="button"
				disabled={isPending || isLoading}
				onClick={() => {
					const params: any = { address, abi, functionName };
					if (args) params.args = args;
					writeContract(params);
				}}
			>
				{isPending ? "Firmando…" : isLoading ? "Enviando…" : isSuccess ? "Ejecutada" : "Ejecutar"}
			</button>
			{children}
			{error ? <p style={{ color: "#f66" }}>{String(error.message || error)}</p> : null}
		</div>
	);
}
