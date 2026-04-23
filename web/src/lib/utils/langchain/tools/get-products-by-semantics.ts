import { PRODUCT_COLUMNS } from '$lib/constants/product-columns'
import { sql } from '$lib/utils/db/postgres'
import { embedQuery } from '$lib/utils/langchain/embeddings'
import { BaseSchema } from '$lib/utils/langchain/tools/schemas/base-schema'
import { tool } from '@langchain/core/tools'
import z from 'zod'

export const getProductsBySemantics = tool(
	async ({ text, limit }) => {
		const embedding = await embedQuery(text)
		const rows = await sql`
			SELECT ${sql(PRODUCT_COLUMNS)}
			FROM products
			ORDER BY
				embedding <=> ${embedding}::vector
			LIMIT ${limit ?? 10}
			`
		return JSON.stringify(rows)
	},
	{
		name: 'get_products_by_semantics',
		description: `
		Use when the query is qualitative or descriptive and cannot be answered be exact filters.
		`,
		schema: BaseSchema.extend({
			text: z.string()
		})
	}
)
