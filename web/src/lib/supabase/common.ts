import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr'

export function makeSupabase(data: any) {
	return isBrowser()
		? createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
				global: {
					fetch
				}
			})
		: createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
				global: {
					fetch
				},
				cookies: {
					getAll() {
						return data.cookies
					}
				}
			})
}
