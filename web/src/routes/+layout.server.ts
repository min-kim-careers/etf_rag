import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, url, cookies }) => {
	console.log('+layout.svelte')

	const { session, user } = await safeGetSession()

	return {
		session,
		user,
		cookies: cookies.getAll()
	}
}
