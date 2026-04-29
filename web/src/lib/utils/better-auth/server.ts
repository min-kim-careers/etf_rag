import { getRequestEvent } from '$app/server'
import { ENV } from '$lib/constants/app-env'
import { dbPool } from '$lib/utils/db/pg'
import { betterAuth } from 'better-auth'
import { sveltekitCookies } from 'better-auth/svelte-kit'

const building = process.env.BUILDING === 'true'

export const auth: ReturnType<typeof betterAuth> = building
	? (null as any)
	: betterAuth({
			baseURL: ENV.BETTER_AUTH_URL,
			secret: ENV.BETTER_AUTH_SECRET,
			database: dbPool,
			plugins: [sveltekitCookies(getRequestEvent)],
			emailAndPassword: {
				enabled: true,
				autoSignIn: false
			},
			user: {
				deleteUser: {
					enabled: true
				}
			}
		})
