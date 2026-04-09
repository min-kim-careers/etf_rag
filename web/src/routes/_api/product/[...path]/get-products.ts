import { parseSearchParams } from '$lib/helpers/parse-search-params'
import type { Product } from '$lib/types/product'
import { dbPool } from '$lib/utils/db/config'
import { json } from '@sveltejs/kit'
import z from 'zod'

const ParamsSchema = z.object({
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(0).max(20).default(10),
	categories: z
		.string()
		.transform((val) =>
			val
				.split('&')
				.map((s) => s.trim())
				.filter(Boolean)
		)
		.optional()
})

export const getProducts = async (params: URLSearchParams): Promise<any> => {
	const { success, data, error } = ParamsSchema.safeParse(parseSearchParams(params))

	if (!success) {
		console.error(error)
		return []
	}

	const { page, limit, categories } = data
	const offset = (page - 1) * limit

	const { rows: products }: { rows: Product[] } = await dbPool.query(
		`
				SELECT *
				FROM products
				${categories?.length ? `WHERE category = ANY($3)` : ''}
				LIMIT $1
				OFFSET $2
				`,
		[limit, offset, ...(categories?.length ? [categories] : [])]
	)

	return json({ products })
}
