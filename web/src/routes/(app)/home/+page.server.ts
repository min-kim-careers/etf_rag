import { APP_ROUTES } from '$lib/constants/app-routes.js'
import { redirect } from '@sveltejs/kit'

export async function load({ parent }) {
	const data = await parent()

	// if (data && data.user) {
	// 	const supabase = makeSupabase(data)

	// 	const { data: profile, error } = await supabase
	// 		.from(profilesTable)
	// 		.select('*')
	// 		.eq('id', data.user.id)
	// 		.single()

	// 	if (!error) {
	// 		return { profile }
	// 	}

	// 	console.error(error)
	// }

	throw redirect(303, APP_ROUTES.profile.create)
}
