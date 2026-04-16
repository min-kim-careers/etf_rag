import { getEventStream, providerList } from '$lib/utils/langchain/config'

const STREAM_CHUNK_SIZE = 20

export const streamChat = async (request: Request) => {
	const { prompt } = await request.json()

	const encoder = new TextEncoder()
	const abort = new AbortController()

	const body = new ReadableStream({
		async start(controller) {
			for (const provider of providerList) {
				if (provider === 'cloud') continue

				const streamActiveProvider = (provider: string) => {
					controller.enqueue(encoder.encode(`__PROVIDER__:${provider}\n`))
				}

				try {
					streamActiveProvider(provider)

					const eventStream = getEventStream(prompt, provider, abort.signal)
					for await (const event of eventStream) {
						if (event.event !== 'on_chat_model_stream') continue
						const content = event.data?.chunk?.content
						if (!content || typeof content !== 'string') continue

						for (let i = 0; i < content.length; i += STREAM_CHUNK_SIZE) {
							const chunk = content.slice(i, i + STREAM_CHUNK_SIZE)
							controller.enqueue(encoder.encode(chunk))
						}
					}
					break
				} catch (err: any) {
					if (err?.name === 'AbortError') return
					if (err?.statusCode === 429 || err?.statusText?.includes('Too Many Requests')) {
						console.warn(`${provider} - 429 - falling back...`)
						continue
					}
					controller.error(err)
					return
				}
			}
			controller.close()
		},
		cancel() {
			abort.abort()
		}
	})

	return new Response(body, {
		headers: { 'Content-Type': 'application/json' }
	})
}
