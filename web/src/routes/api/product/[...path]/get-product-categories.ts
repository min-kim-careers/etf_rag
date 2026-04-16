import type { ProductCategory } from '$lib/types/product-category'
import { dbPool } from '$lib/utils/db/config'

export const getProductCategories = async () => {
	const { rows: categories }: { rows: ProductCategory[] } = await dbPool.query(
		`SELECT * FROM product_categories`
	)

	return categories
}
