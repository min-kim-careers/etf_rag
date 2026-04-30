// import { PRODUCT_CATEGORIES } from '$lib/constants/product-categories'
// import { json } from '@sveltejs/kit'
// import { getProducts } from './get-products'

// export const GET = async ({ params, url }): Promise<any> => {
// 	switch (params.path) {
// 		case '':
// 			const products = await getProducts(url.searchParams)
// 			return json({ products })

// 		case 'categories':
// 			return json({ categories: Object.values(PRODUCT_CATEGORIES) })

// 		default:
// 			break
// 	}
// }
