import { PRODUCT_COLUMNS } from '$lib/constants/product-columns'
import { dbPool } from '$lib/utils/db/config'
import { tool } from 'langchain'
import z from 'zod'

export const getProductDetailsTool = tool(
	async ({ product_ids, columns }) => {
		try {
			const cols = columns.map((c) => `"${c}"`).join(', ')
			const { rows } = await dbPool.query(`SELECT ${cols} FROM products WHERE id = ANY($1)`, [
				product_ids
			])
			return JSON.stringify(rows)
		} catch (error) {
			console.error(error)
		}
	},
	{
		name: 'get_product_details',
		description: `Get specific product data by ID. Available columns: ${PRODUCT_COLUMNS}`,
		schema: z.object({
			product_ids: z.array(z.number()),
			columns: z.array(z.string())
		})
	}
)
