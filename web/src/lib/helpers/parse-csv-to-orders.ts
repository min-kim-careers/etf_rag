import { orderSchema } from '$lib/schemas/order'
import type { CsvRow } from '$lib/types/csv-row'
import type { Mapper } from '$lib/types/mapper'
import type { MappingResults } from '$lib/types/mapping-result'

export const parseCsvToOrders = (rows: CsvRow[], mapper: Mapper): MappingResults => {
	const result: MappingResults = {
		mapper,
		valid: [],
		invalid: []
	}

	rows.map((row) => {
		const mapped = Object.fromEntries(
			Object.entries(mapper as Mapper).map(([k, v]) => [k, row[v as string]])
		)

		const res = orderSchema.safeParse(mapped)

		if (res.success) {
			result.valid.push(res.data)
		} else {
			result.invalid.push({
				row,
				mapped,
				fieldErrors: res.error ? res.error.flatten().fieldErrors : {}
			})
		}
	})

	return result
}
