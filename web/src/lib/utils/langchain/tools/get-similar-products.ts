import { PRODUCT_COLUMNS } from '$lib/constants/product-columns'
import { dbPool } from '$lib/utils/db/config'
import { embedQuery } from '$lib/utils/langchain/embeddings'
import { tool } from '@langchain/core/tools'
import z from 'zod'

export const getSimilarProductsTool = tool(
	async ({ text, columns }) => {
		try {
			const embedding = await embedQuery(text)
			console.log('embedding ok, length:', embedding.length)

			const cols = columns.map((c) => `"${c}"`).join(', ')
			const { rows: products } = await dbPool.query(
				`SELECT ${cols} FROM products ORDER BY embedding <=> $1::vector LIMIT 10`,
				[JSON.stringify(embedding)]
			)

			console.log('products found:', products.length)
			return JSON.stringify(products)
		} catch (err) {
			console.error('getSimilarProductsTool error:', err)
			throw err
		}
	},
	{
		name: 'get_similar_products',
		description: `Search ETF products by semantic similarity. Available columns: ${PRODUCT_COLUMNS}`,
		schema: z.object({
			text: z.string(),
			columns: z.array(z.string())
		})
	}
)
