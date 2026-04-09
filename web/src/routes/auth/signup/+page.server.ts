import { APP_ROUTES } from '$lib/constants'
import { setFlash } from '$lib/helpers/flash-helpers'
import { auth } from '$lib/utils/better-auth/server'
import { fail, redirect } from '@sveltejs/kit'
import { zod4 } from 'sveltekit-superforms/adapters'
import { setError, superValidate } from 'sveltekit-superforms/server'
import { schema } from './schema'

export async function load() {
	return {
		form: await superValidate(zod4(schema), {
			defaults: { name: 'some name', email: 'someemail@gmail.com', password: 'some1234' },
			errors: true
		})
	}
}

export const actions = {
	default: async ({ request, locals, cookies }) => {
		const form = await superValidate(request, zod4(schema))

		if (!form.valid) {
			return fail(400, { form })
		}

		try {
			await auth.api.signUpEmail({
				body: {
					name: form.data.name,
					email: form.data.email,
					password: form.data.password
				}
			})

			setFlash({ cookies, path: APP_ROUTES.home, key: 'created-account', value: '1' })
		} catch (error) {
			console.error(error)

			setError(form, 'email', 'That email is taken.')
			return fail(400, { form })
		}

		throw redirect(303, APP_ROUTES.auth.login)
	}
}
