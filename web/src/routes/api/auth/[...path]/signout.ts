import { auth } from '$lib/utils/better-auth/config'
import { json } from '@sveltejs/kit'

export const signout = async (request: Request) => {
	try {
		await auth.api.signOut({ headers: request.headers })
		return json({ success: true })
	} catch (err) {
		console.error(err)
		return json({ error: 'Sign out failed' }, { status: 500 })
	}
}
