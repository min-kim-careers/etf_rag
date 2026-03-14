import { tool } from '@langchain/core/tools'
import z from 'zod'
import { getProductCategories } from '../../../routes/api/product/[...path]/get-product-categories'

export const getProductCategoriesTool = tool(
	async () => {
		const categories = await getProductCategories()
		return categories.map((c) => ({
			name: c.name
				.split('_')
				.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
				.join(' ')
		}))
	},
	{
		name: 'get_product_categories',
		description: 'Get list of ETF product categories',
		schema: z.object({})
	}
)
