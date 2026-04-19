import { LOCAL_LLM_URL } from '$env/static/private'
import type { Message } from '$lib/types/message'
import { json } from '@sveltejs/kit'
import { streamChat } from './stream-chat'

export const GET = async ({ request, params }) => {
	switch (params.path) {
		case 'ping':
			try {
				await fetch(`${LOCAL_LLM_URL}/health`)
				return json({ ok: true })
			} catch {
				return json({ ok: false })
			}

		default:
			break
	}
}

export const POST = async ({ request, params }) => {
	switch (params.path) {
		case 'stream':
			const { messages }: { messages: Message[] } = await request.json()
			const stream = await streamChat(messages)
			return stream

		default:
			break
	}
}
