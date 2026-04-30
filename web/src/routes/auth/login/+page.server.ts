import { ENV } from '$lib/constants/app-env'
import { FLAGS } from '$lib/constants/app-flags'
import { APP_ROUTES } from '$lib/constants/app-routes'
import { getFlash, setFlash } from '$lib/helpers/flash-helpers'
import { auth } from '$lib/utils/better-auth/server'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import { zod4 } from 'sveltekit-superforms/adapters'
import { setError, superValidate } from 'sveltekit-superforms/server'
import { schema } from './schema'

export const load = async ({ cookies, locals, request }) => {
	const form = await superValidate(
		{ email: ENV.ADMIN_USER, password: ENV.ADMIN_PASSWORD },
		zod4(schema),
		{
			errors: false
		}
	)

	const createdAccount = getFlash({ cookies, path: APP_ROUTES.home, key: 'created-account' })

	return { form, createdAccount, signupEnabled: FLAGS.SIGNUP_ENABLED }
}

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		let form
		try {
			form = await superValidate(request, zod4(schema))

			if (!form.valid) {
				return fail(400, { form })
			}
			await auth.api.signInEmail({
				body: {
					email: form.data.email,
					password: form.data.password
				}
			})

			setFlash({ cookies, path: APP_ROUTES.home, key: 'signed-in', value: '1' })
		} catch (error) {
			if (form) {
				setError(form, 'password', 'Invalid email or password')
				return { form }
			}
			return fail(400)
		}

		throw redirect(303, APP_ROUTES.home)
	}
}
