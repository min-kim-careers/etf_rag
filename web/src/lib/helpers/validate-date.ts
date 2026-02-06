import { isValidYear } from '$lib/helpers/is-valid-year'
import { isValid, parse } from 'date-fns'
import { enAU } from 'date-fns/locale'

export const validateDate = (v: string) => {
	const parsedDate = parse(v, 'dd/MM/yyyy', new Date(), { locale: enAU })
	if (!isValid(parsedDate)) {
		return false
	}
	return isValidYear(v)
}
