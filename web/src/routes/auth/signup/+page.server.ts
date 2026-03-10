import { APP_ROUTES } from '$lib/constants/app-routes'
import { auth } from '$lib/utils/better-auth/config'
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
	default: async ({ request, locals }) => {
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
		} catch (error) {
			setError(form, 'email', 'That email already exists.')
			return { form }
		}

		throw redirect(303, APP_ROUTES.home)
	}
}
