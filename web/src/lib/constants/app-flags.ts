import { env } from '$env/dynamic/private'

export const FLAGS = {
	SIGNUP_ENABLED: env.SIGNUP_ENABLED === 'true',
	RATE_LIMIT_ENABLED: env.RATE_LIMIT_ENABLED === 'true'
}
