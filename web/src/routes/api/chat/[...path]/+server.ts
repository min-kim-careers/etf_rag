import { APP_ROUTES } from '$lib/constants/app_routes'
import { ENV } from '$lib/constants/env'
import type { Message } from '$lib/types/message'
import type { Provider } from '$lib/utils/langchain/config'
import { getIp } from '$routes/api/chat/[...path]/get-ip'
import { getRemainingLimit } from '$routes/api/chat/[...path]/rate-limit'
import { json, redirect } from '@sveltejs/kit'
import { streamChat } from './stream-chat'

export const GET = async ({ request, params, locals }) => {
	if (!locals.session) throw redirect(302, APP_ROUTES.home)

	switch (params.path) {
		case 'ping':
			try {
				await fetch(`${ENV.LOCAL_LLM_URL}/health`)
				return json({ ok: true })
			} catch (e) {
				console.error(e)
				return json({ ok: false })
			}

		case 'limit':
			const limit = await getRemainingLimit(getIp(request))
			return json({ limit })

		default:
			break
	}
}

export const POST = async ({ request, params, locals }) => {
	if (!locals.session) throw redirect(302, APP_ROUTES.home)

	switch (params.path) {
		case 'stream':
			// const { allowed, remaining } = await checkRemainingLimit(getIp(request))
			// if (!allowed) error(429, 'Rate limit exceeded')

			const { messages, provider }: { messages: Message[]; provider: Provider } =
				await request.json()
			const stream = await streamChat(messages, 1, provider)
			return new Response(stream, {
				headers: { 'Content-Type': 'application/json' }
			})

		default:
			break
	}
}
