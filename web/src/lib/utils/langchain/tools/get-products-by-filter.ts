import { PRODUCT_CATEGORIES } from '$lib/constants/product-categories'
import { PRODUCT_COLUMNS } from '$lib/constants/product-columns'
import { PRODUCT_REGIONS } from '$lib/constants/product-regions'
import { sql } from '$lib/utils/db/postgres'
import { BaseSchema } from '$lib/utils/langchain/tools/schemas/base-schema'
import { tool } from 'langchain'
import z from 'zod'

export const getProductsByFilter = tool(
	async ({ asx_code, region, category, mer_pa_max, fum_m_min, order_by, order_dir, limit }) => {
		const rows = await sql`
			SELECT ${sql(PRODUCT_COLUMNS)}
			FROM products
			WHERE
				${asx_code ? sql`asx_code = ${asx_code}` : sql`TRUE`}
				AND ${region ? sql`region = ${region}` : sql`TRUE`}
				AND ${category ? sql`category = ${category}` : sql`TRUE`}
				AND ${mer_pa_max ? sql`mer_pa <= ${mer_pa_max}` : sql`TRUE`}
				AND ${fum_m_min ? sql`fum_m >= ${fum_m_min}` : sql`TRUE`}
			ORDER BY
				${order_by ? sql`${sql(order_by)} ${order_dir === 'asc' ? sql`ASC` : sql`DESC`}` : sql`fum_m DESC`}
			LIMIT ${limit ?? 10}
			`
		return JSON.stringify(rows)
	},
	{
		name: 'get_products_by_filter',
		description: `
		Filter ETFs by specific criteria. Use this for queries like "US ETFs", "Australian equity ETFs", or "ETFs under 0.2% MER".
		Filterable fields:
		- region: ${Object.keys(PRODUCT_REGIONS).join(', ')}
		- category: ${Object.keys(PRODUCT_CATEGORIES).join(', ')}
		- mer_pa_max: maximum MER percentage
		- fum_m_min: minimum funds under management in millions
		`,
		schema: BaseSchema.extend({
			asx_code: z.string().optional(),
			region: z.string().optional(),
			category: z.string().optional(),
			mer_pa_max: z.number().optional(),
			fum_m_min: z.number().optional(),

			order_by: z
				.enum([
					'mer_pa',
					'fum_m',
					'1_year_total_return',
					'3_year_total_return_ann',
					'5_year_total_return_ann',
					'historical_distribution_yield'
				])
				.optional(),
			order_dir: z.enum(['asc', 'desc']).optional()
		})
	}
)
