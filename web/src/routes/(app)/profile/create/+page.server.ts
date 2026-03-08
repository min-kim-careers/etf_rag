import { type Actions } from '@sveltejs/kit'
import { zod4 } from 'sveltekit-superforms/adapters'
import { superValidate } from 'sveltekit-superforms/server'
import { schema } from './schema'

export const load = async () => {
	const form = await superValidate(zod4(schema), {})

	return { form }
}

export const actions: Actions = {
	default: async ({ request, locals }) => {
		// throw redirect(303, APP_ROUTES.home)
	}
}
