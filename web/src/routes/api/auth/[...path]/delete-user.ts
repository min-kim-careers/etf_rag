import { auth } from '$lib/utils/better-auth/server'

export async function deleteCurrentUser(request: Request) {
	await auth.api.deleteUser({ headers: request.headers, body: {} })
}
