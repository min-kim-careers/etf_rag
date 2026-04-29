import { APP_ROUTES } from '$lib/constants/app-routes'
import { getFlash } from '$lib/helpers/flash-helpers.js'
import { redirect } from '@sveltejs/kit'

export async function load({ request, cookies, locals }) {
	try {
		const username = locals?.user?.name

		const signedIn = getFlash({ cookies, path: APP_ROUTES.home, key: 'signed-in' })

		return { username, signedIn }
	} catch (err) {
		console.error(err)
		throw redirect(401, APP_ROUTES.signout)
	}
}
