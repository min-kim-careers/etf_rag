import { type ProductCategory } from '$lib/types/product-category'
import { dbPool } from '$lib/utils/db/config'
import { tool } from '@langchain/core/tools'
import z from 'zod'

export const getProductCategoriesTool = tool(
	async () => {
		try {
			const { rows: categories }: { rows: ProductCategory[] } = await dbPool.query(
				`SELECT * FROM product_categories`
			)
			return JSON.stringify(
				categories.map((c) => ({
					name: c.name
						.split('_')
						.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
						.join(' ')
				}))
			)
		} catch (error) {
			console.error(error)
		}
	},
	{
		name: 'get_product_categories',
		description: 'Get list of ETF product categories',
		schema: z.object({})
	}
)
