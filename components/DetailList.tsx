"use client";

import React from "react";

export function toDisplay(value: unknown): string {
	if (typeof value === "bigint") return value.toString();
	if (Array.isArray(value)) return value.map((v) => toDisplay(v)).join(", ");
	if (typeof value === "object" && value !== null) return JSON.stringify(value);
	return String(value ?? "-");
}

export default function DetailList({ items }: { items: { label: string; value: unknown }[] }) {
	return (
		<dl className="details card">
			{items.map((it) => (
				<React.Fragment key={it.label}>
					<dt className="detail-label">{it.label}</dt>
					<dd className="detail-value">{toDisplay(it.value)}</dd>
				</React.Fragment>
			))}
		</dl>
	);
}


