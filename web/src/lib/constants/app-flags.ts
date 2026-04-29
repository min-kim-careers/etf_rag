import { env } from '$env/dynamic/private'

export const flags = {
	signup: env.SIGNUP_ENABLED === 'true'
}
