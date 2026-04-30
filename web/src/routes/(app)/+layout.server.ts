import { FLAGS } from '$lib/constants/app-flags.js'
import { APP_ROUTES } from '$lib/constants/app-routes'
import { getFlash } from '$lib/helpers/flash-helpers.js'
import { getRemainingLimit } from '$routes/api/chat/[...path]/rate-limit.js'
import { redirect } from '@sveltejs/kit'

export async function load({ request, cookies, locals }) {
	try {
		if (!locals.user || !locals.session) throw new Error('Unauthenticated')

		const username = locals.user.name

		const signedIn = getFlash({ cookies, path: APP_ROUTES.home, key: 'signed-in' })

		const remainingLimit = await getRemainingLimit(locals.session.id)

		return { username, signedIn, rateLimited: FLAGS.RATE_LIMIT_ENABLED, remainingLimit }
	} catch (err) {
		console.error(err)
		throw redirect(401, APP_ROUTES.signout)
	}
}
