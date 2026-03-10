import { getRequestEvent } from '$app/server'
import { DB_URL } from '$env/static/private'
import { betterAuth } from 'better-auth'
import { sveltekitCookies } from 'better-auth/svelte-kit'
import { Pool } from 'pg'

export const auth = betterAuth({
	emailAndPassword: {
		enabled: true
	},
	database: new Pool({
		// connection options
		connectionString: DB_URL
	}),
	plugins: [sveltekitCookies(getRequestEvent)]
})
