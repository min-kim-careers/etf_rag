import { APP_ROUTES } from '$lib/constants'
import { getFlash } from '$lib/helpers/flash-helpers.js'
import { auth } from '$lib/utils/better-auth/server'
import { redirect } from '@sveltejs/kit'

export async function load({ request, cookies }) {
	try {
		const session = await auth.api.getSession({ headers: request.headers })
		if (!session?.user.name) {
			throw new Error()
		}

		const signedIn = getFlash({ cookies, path: APP_ROUTES.home, key: 'signed-in' })

		return { username: session.user.name, signedIn }
	} catch (error) {
		console.error(error)
		throw redirect(401, APP_ROUTES.signout)
	}
}
