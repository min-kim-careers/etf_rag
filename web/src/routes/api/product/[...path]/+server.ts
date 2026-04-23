import { PRODUCT_CATEGORIES } from '$lib/constants/product-categories'
import { json } from '@sveltejs/kit'
import { getProducts } from './get-products'

export const GET = async ({ params, url }): Promise<any> => {
	switch (params.path) {
		case 'query':
			const products = await getProducts(url.searchParams)
			return json({ products })

		case 'categories':
			return json({ categories: PRODUCT_CATEGORIES })

		default:
			break
	}
}
