import { dbPool } from '$lib/utils/db/config'
import { json } from '@sveltejs/kit'

type Category = {
	name: string
}

export const getProductCategories = async () => {
	const { rows: categories }: { rows: Category[] } = await dbPool.query(
		`SELECT * FROM product_categories`
	)

	return json({ categories })
}
