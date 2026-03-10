import { auth } from '$lib/utils/better-auth/config'
import { json } from '@sveltejs/kit'

export const POST = async ({ request }) => {
	try {
		await auth.api.signOut({ headers: request.headers })
		return json({ success: true })
	} catch (error) {
		console.error(error)
		return json({ error: 'Sign out failed' }, { status: 500 })
	}
}
