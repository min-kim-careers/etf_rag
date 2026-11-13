import { auth } from '$lib/utils/better-auth/config.js'
import { json } from '@sveltejs/kit'

export const POST = async ({ params, request, locals }): Promise<any> => {
	switch (params.path) {
		case 'delete':
			const { password } = await request.json()
			await auth.api.deleteUser({ body: { password }, headers: request.headers })
			return json({})

		default:
			break
	}
}
