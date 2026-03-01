import { APP_ROUTES } from '$lib/constants/app-routes'
import { auth } from '$lib/utils/auth'
import { redirect, type Actions } from '@sveltejs/kit'

export const actions: Actions = {
	default: async ({ request }) => {
		await auth.api.signOut({ headers: request.headers })
		throw redirect(303, APP_ROUTES.auth.login)
	}
}
