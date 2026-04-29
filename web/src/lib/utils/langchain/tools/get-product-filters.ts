import { PRODUCT_CATEGORIES } from '$lib/constants/product-categories'
import { PRODUCT_REGIONS } from '$lib/constants/product-regions'
import { tool } from 'langchain'
import z from 'zod'

export const getProductFilters = tool(
	async () =>
		JSON.stringify({
			categories: Object.values(PRODUCT_CATEGORIES),
			regions: Object.values(PRODUCT_REGIONS)
		}),
	{
		name: 'get_product_filters',
		description:
			'Returns available filter options including categories and regions for ETF products',
		schema: z.object({})
	}
)
