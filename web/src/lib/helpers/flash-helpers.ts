import { dev } from '$app/environment'
import type { Cookies } from '@sveltejs/kit'

// 1. set flash in previous page
export const setFlash = (opts: {
	cookies: Cookies
	path: string
	key: string

	value: string
}) => {
	const { cookies, path, key, value } = opts
	cookies.set(key, value, {
		path,
		maxAge: 10,
		httpOnly: true,
		sameSite: 'lax',
		secure: !dev
	})
}

// 2. fetch and delete flash in next page server
export const getFlash = (opts: { cookies: Cookies; path: string; key: string }) => {
	const { cookies, path, key } = opts

	const flash = cookies.get(key)
	if (!flash) {
		return
	}

	cookies.delete(key, { path, sameSite: 'lax', secure: !dev })
	return flash
}
