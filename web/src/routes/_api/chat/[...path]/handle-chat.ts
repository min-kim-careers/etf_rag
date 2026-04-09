import { getEventStream, providerList } from '$lib/utils/langchain/config'

const notify = (
	controller: ReadableStreamDefaultController,
	encoder: TextEncoder,
	message: string
) => {
	controller.enqueue(encoder.encode(`__STATUS__:${message}\n`))
}

const STREAM_CHUNK_SIZE = 20

export const streamChat = async (request: Request) => {
	const { prompt } = await request.json()
	const encoder = new TextEncoder()

	const body = new ReadableStream({
		async start(controller) {
			for (const provider of providerList) {
				if (provider === 'cloud') continue

				try {
					notify(controller, encoder, provider)

					const eventStream = getEventStream(prompt, provider)

					for await (const event of eventStream) {
						// console.log(`event - ${event.event}`)

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
					if (err?.statusCode === 429 || err?.statusText?.includes('Too Many Requests')) {
						console.warn(`${provider} - 429 - falling back to next provider...`)
						continue
					}

					console.error(err)
					controller.error(err)
					return
				}
			}

			controller.close()
		}
	})

	return new Response(body, {
		headers: { 'Content-Type': 'application/json' }
	})
}
