import { env } from '$lib/utils/env'

export const getSession = () => cookieStore.get(env.sessionHeader)
