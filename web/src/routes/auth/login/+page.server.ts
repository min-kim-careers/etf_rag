import { APP_ROUTES } from '$lib/constants/app-routes'
import { fail, redirect } from '@sveltejs/kit'
import { zod4 } from 'sveltekit-superforms/adapters'
import { superValidate } from 'sveltekit-superforms/server'
import { schema } from './schema'

export async function load() {
	return {
		form: await superValidate(zod4(schema), {
			defaults: { email: 'someemail@gmail.com', password: 'some1234' },
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

		// const { error } = await locals.supabase.auth.signInWithPassword(form.data)

		// if (error) {
		// 	return fail(400, { form })
		// }

		throw redirect(303, APP_ROUTES.app.home)
	}
}
