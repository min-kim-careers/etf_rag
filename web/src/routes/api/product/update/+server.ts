import { API_URL } from '$env/static/private'
import { fail, json } from '@sveltejs/kit'

export const POST = async () => {
	try {
		await fetch(API_URL + '/api/product/download-and-clean', { method: 'POST' })
		return json({})
	} catch (error) {
		return fail(400)
	}
}
