import { parseSearchParams } from '$lib/helpers/parse-search-params'
import { sql } from '$lib/utils/db/postgres'
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

	const products = await sql`
		SELECT *
		FROM products
		WHERE
		${categories?.length ? `category = ANY(${sql(categories)})` : 'TRUE'}
		LIMIT ${limit}
		OFFSET ${offset}
		`

	return products
}
