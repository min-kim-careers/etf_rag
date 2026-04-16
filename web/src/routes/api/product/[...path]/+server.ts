import { json } from '@sveltejs/kit'
import { getProductCategories } from './get-product-categories'
import { getProducts } from './get-products'

export const GET = async ({ params, url }): Promise<any> => {
	switch (params.path) {
		case '':
			const products = await getProducts(url.searchParams)
			return json({ products })

		case 'categories':
			const categories = await getProductCategories()
			return json({ categories })

		default:
			break
	}
}
