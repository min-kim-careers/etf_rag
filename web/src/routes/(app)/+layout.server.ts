import { APP_ROUTES } from '$lib/constants/app-routes.js'
import { auth } from '$lib/utils/better-auth/config'
import { redirect } from '@sveltejs/kit'

export async function load({ request }) {
	try {
		const session = await auth.api.getSession({ headers: request.headers })
		if (!session?.user.name) {
			throw new Error()
		}

		return { username: session.user.name }
	} catch (error) {
		console.error(error)

		throw redirect(401, APP_ROUTES.signout)
	}
}
