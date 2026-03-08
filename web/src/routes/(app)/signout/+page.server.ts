import { auth } from '$lib/utils/auth'
import { type Actions } from '@sveltejs/kit'

export const actions: Actions = {
	default: async ({ request }) => {
		await auth.api.signOut({ headers: request.headers })
	}
}
