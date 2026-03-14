import { API_URL } from '$env/static/private'
import { fail, json } from '@sveltejs/kit'
import { getProductCategories } from './get-product-categories'
import { getProducts } from './get-products'

export const GET = async ({ params, url }) => {
	switch (params.path) {
		case '':
			return json({ products: await getProducts(url.searchParams) })

		case '/categories':
			return json({ categories: await getProductCategories() })

		default:
			break
	}
}

export const POST = async () => {
	try {
		await fetch(API_URL + '/api/product/update', { method: 'POST' })
		return json({ success: true })
	} catch (error) {
		return fail(400)
	}
}
