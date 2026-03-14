import { dbPool } from '$lib/utils/db/config'

type Category = {
	name: string
}

export const getProductCategories = async (): Promise<Category[]> => {
	const { rows }: { rows: Category[] } = await dbPool.query(`SELECT * FROM product_categories`)

	return rows
}
