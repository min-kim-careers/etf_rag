import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
import { APP_ROUTES } from '$lib/constants/app-routes'
import { createServerClient } from '@supabase/ssr'
import { redirect, type Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
	console.log('hooks.server.ts')

	skipSupabaseWarn()

	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
		cookies: {
			getAll() {
				return event.cookies.getAll()
			},
			setAll(cookiesToSet) {
				/**
				 * Note: You have to add the `path` variable to the
				 * set and remove method due to sveltekit's cookie API
				 * requiring this to be set, setting the path to an empty string
				 * will replicate previous/standard behavior (https://kit.svelte.dev/docs/types#public-types-cookies)
				 */
				cookiesToSet.forEach(({ name, value, options }) =>
					event.cookies.set(name, value, { ...options, path: '/' })
				)
			}
		}
	})

	/**
	 * Unlike `supabase.auth.getSession()`, which returns the session _without_
	 * validating the JWT, this function also calls `getUser()` to validate the
	 * JWT before returning the session.
	 */
	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession()
		if (!session) {
			return { session: null, user: null }
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser()
		if (error) {
			// JWT validation has failed
			return { session: null, user: null }
		}

		return { session, user }
	}

	const { session } = await event.locals.safeGetSession()

	if (!session && !event.url.pathname.startsWith('/auth')) {
		throw redirect(303, APP_ROUTES.auth.login)
	} else if (session && !event.url.pathname.startsWith('/app')) {
		throw redirect(303, APP_ROUTES.app.home)
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version'
		}
	})
}

function skipSupabaseWarn() {
	const originalWarn = console.warn
	console.warn = (...args) => {
		if (
			typeof args[0] === 'string' &&
			args[0].includes('Using the user object as returned from supabase.auth.getSession()')
		) {
			return // skip this specific message
		}
		originalWarn(...args)
	}
}
