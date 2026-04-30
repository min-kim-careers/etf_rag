import { building } from '$app/environment'
import { ENV } from '$lib/constants/app-env'
import { APP_ROUTES } from '$lib/constants/app-routes'
import { auth } from '$lib/utils/better-auth/config'
import { redirect } from '@sveltejs/kit'
import { svelteKitHandler } from 'better-auth/svelte-kit'

async function createTempUser() {
	try {
		await auth.api.signUpEmail({
			body: {
				name: 'temp_user',
				email: ENV.TEMP_USER,
				password: ENV.TEMP_PASSWORD
			}
		})
	} catch (error) {}
}

export async function handle({ event, resolve }) {
	await createTempUser()

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
