import { type Actions } from '@sveltejs/kit'
import { zod4 } from 'sveltekit-superforms/adapters'
import { superValidate } from 'sveltekit-superforms/server'
import { schema } from './schema'

export const load = async () => {
	const form = await superValidate(zod4(schema), {
		// defaults: { name: '' },
		// errors: true
	})

	return { form }
}

export const actions: Actions = {
	default: async ({ request, locals }) => {
		// const form = await superValidate(request, zod4(schema))
		// if (!form.valid) {
		// 	return fail(400, { form })
		// }
		// try {
		// 	await auth.api.signInEmail({
		// 		body: {
		// 			email: form.data.email,
		// 			password: form.data.password
		// 		}
		// 	})
		// } catch (error) {
		// 	setError(form, 'password', 'Invalid email or password')
		// 	return { form }
		// }
		// throw redirect(303, APP_ROUTES.home)
	}
}
