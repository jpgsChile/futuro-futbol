export function stringifyBigint(value: unknown): string {
	return JSON.stringify(
		value,
		(_key, v) => (typeof v === "bigint" ? v.toString() : v),
		2
	);
}


