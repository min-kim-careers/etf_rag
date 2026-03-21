import { APP_ROUTES } from '$lib/constants/app-routes'
import { setFlash } from '$lib/helpers/flash-helpers'
import { auth } from '$lib/utils/better-auth/server'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import { zod4 } from 'sveltekit-superforms/adapters'
import { setError, superValidate } from 'sveltekit-superforms/server'
import { schema } from './schema'

export const load = async () => {
	const form = await superValidate(zod4(schema), {
		defaults: { email: 'someemail@gmail.com', password: 'some1234' },
		errors: true
	})

	return { form }
}

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(schema))

		if (!form.valid) {
			return fail(400, { form })
		}

		try {
			await auth.api.signInEmail({
				body: {
					email: form.data.email,
					password: form.data.password
				}
			})

			setFlash({ cookies, path: APP_ROUTES.home, key: 'signed-in', value: '1' })
		} catch (error) {
			setError(form, 'password', 'Invalid email or password')
			return { form }
		}

		throw redirect(303, APP_ROUTES.home)
	}
}
