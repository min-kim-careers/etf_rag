import { building } from '$app/environment'
import { APP_ROUTES } from '$lib/constants/app-routes'
import { auth } from '$lib/utils/better-auth/server'
import { redirect } from '@sveltejs/kit'
import { svelteKitHandler } from 'better-auth/svelte-kit'

export async function handle({ event, resolve }) {
	const pathname = event.url.pathname
	const session = await auth.api.getSession({ headers: event.request.headers })
	if (session) {
		event.locals.session = session.session
		event.locals.user = session.user
	}

	if (event.locals.session && pathname.startsWith('/auth')) {
		console.log('redirect to home')

		throw redirect(302, APP_ROUTES.home)
	}

	if (!event.locals.session && !pathname.startsWith('/auth')) {
		console.log('redirect to login')

		throw redirect(302, APP_ROUTES.auth.login)
	}

	return svelteKitHandler({ event, resolve, auth, building })
}
