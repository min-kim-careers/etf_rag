import { getRequestEvent } from '$app/server'
import { dbPool } from '$lib/utils/db/config'
import { betterAuth } from 'better-auth'
import { sveltekitCookies } from 'better-auth/svelte-kit'

export const auth = betterAuth({
	emailAndPassword: {
		enabled: true
	},
	database: dbPool,
	plugins: [sveltekitCookies(getRequestEvent)]
})
