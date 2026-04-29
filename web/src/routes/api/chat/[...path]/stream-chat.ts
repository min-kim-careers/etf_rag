import type { Message } from '$lib/types/message'
import { getEventStream, type Provider } from '$lib/utils/langchain/config'

// response streaming speed, higher = faster
const STREAM_CHUNK_SIZE = 10

const CONNECTION_TIMEOUT = 5000

export type Meta = Partial<{
	provider: Provider
	remainingLimit: number
	error?: 'server_offline'
}>

export const streamChat = async (
	messages: Message[],
	remainingLimit: number,
	provider: Provider
) => {
	const encoder = new TextEncoder()
	const abort = new AbortController()

	return new ReadableStream({
		async start(controller) {
			const streamMeta = (meta: Meta) => {
				controller.enqueue(encoder.encode(`__META__:${JSON.stringify(meta)}\n`))
			}

			let timedOut = false

			try {
				streamMeta({ provider, remainingLimit })

				const eventStream = getEventStream(messages, provider, abort.signal)

				let connected = false

				await Promise.race([
					(async () => {
						for await (const event of eventStream) {
							console.log(event.event)

							if (timedOut) break

							if (event.event !== 'on_chat_model_stream') continue

							const content = event.data?.chunk?.content

							if (!content || typeof content !== 'string') continue

							connected = true

							for (let i = 0; i < content.length; i += STREAM_CHUNK_SIZE) {
								const chunk = content.slice(i, i + STREAM_CHUNK_SIZE)
								controller.enqueue(encoder.encode(chunk))
							}
						}
					})(),
					new Promise((_, reject) =>
						setTimeout(() => {
							if (!connected) {
								timedOut = true
								abort.abort()
								reject()
							}
						}, CONNECTION_TIMEOUT)
					)
				])
			} catch (err: any) {
				console.error('Streaming error:', err)

				if (timedOut) {
					streamMeta({ error: 'server_offline' })
				} else {
					controller.error(err)
				}
			}

			controller.close()
		},
		cancel() {
			abort.abort()
		}
	})
}
