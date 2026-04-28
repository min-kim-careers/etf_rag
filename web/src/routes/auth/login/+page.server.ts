import { APP_ROUTES } from '$lib/constants/app_routes'
import { getFlash, setFlash } from '$lib/helpers/flash-helpers'
import { auth } from '$lib/utils/better-auth/server'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import { zod4 } from 'sveltekit-superforms/adapters'
import { setError, superValidate } from 'sveltekit-superforms/server'
import { schema } from './schema'

const mockForm = { email: 'someemail@gmail.com', password: 'some1234' }

export const load = async ({ cookies }) => {
	const form = await superValidate(zod4(schema), {
		defaults: mockForm,
		errors: true
	})

	const createdAccount = getFlash({ cookies, path: APP_ROUTES.home, key: 'created-account' })

	return { form, createdAccount }
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
