import { format, parseISO } from 'date-fns'

export function isoToAuDate(iso: string) {
	const parsed = parseISO(iso)
	const aus = format(parsed, 'dd/MM/yyyy')
	return aus
}
