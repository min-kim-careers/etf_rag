import { signout } from './signout'

export const POST = async ({ request, params, url }) => {
	switch (params.path) {
		case 'signout':
			return await signout(request)

		default:
			return new Response('Not Found', { status: 404 })
	}
}
