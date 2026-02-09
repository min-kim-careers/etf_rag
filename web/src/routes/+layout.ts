import { makeSupabase } from '$lib/supabase/common'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
	depends('supabase:auth')

	const supabase = makeSupabase(data)

	/**
	 * It's fine to use `getSession` here, because on the client, `getSession` is
	 * safe, and on the server, it reads `session` from the `LayoutData`, which
	 * safely checked the session using `safeGetSession`.
	 */
	const {
		data: { session }
	} = await supabase.auth.getSession()

	return { supabase, session }
}
