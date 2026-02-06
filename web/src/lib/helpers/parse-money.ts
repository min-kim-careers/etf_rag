export function parseMoney(value: string): number {
	if (!value) return 0

	// Trim and detect negatives like "(1,000.00)"
	const isNegative = /^\(.*\)$/.test(value)

	// Remove all except digits, decimal, and minus
	const numeric = value.replace(/[^0-9.-]+/g, '')

	const num = parseFloat(numeric)
	if (Number.isNaN(num)) return 0

	return isNegative ? -num : num
}
