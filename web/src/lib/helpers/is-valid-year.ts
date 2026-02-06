export const isValidYear = (v: string) => {
	const parts = v.split('/')
	if (parts.length !== 3) return false // not dd/mm/yyyy
	const year = parts[2]
	return /^\d{4}$/.test(year) // numeric + 4 digits
}
