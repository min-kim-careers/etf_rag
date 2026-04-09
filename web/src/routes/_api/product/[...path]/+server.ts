import { getProductCategories } from './get-product-categories'
import { getProducts } from './get-products'

export const GET = async ({ params, url }): Promise<any> => {
	switch (params.path) {
		case '':
			await getProducts(url.searchParams)

		case 'categories':
			await getProductCategories()

		default:
			break
	}
}
