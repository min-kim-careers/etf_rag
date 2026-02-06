import { format, parse } from 'date-fns'

export function auToIsoDate(d: string) {
	const parsed = parse(d, 'dd/MM/yyyy', new Date())
	const iso = format(parsed, 'yyyy-MM-dd')
	return iso
}
