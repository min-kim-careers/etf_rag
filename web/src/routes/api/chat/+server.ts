import { getEventStream, providerList } from '$lib/utils/langchain/config'

const streamSpeed = 10

const notify = (
	controller: ReadableStreamDefaultController,
	encoder: TextEncoder,
	message: string
) => {
	controller.enqueue(encoder.encode(`__STATUS__:${message}\n`))
}

export const POST = async ({ request }) => {
	const { prompt } = await request.json()
	const encoder = new TextEncoder()

	const body = new ReadableStream({
		async start(controller) {
			for (const provider of providerList) {
				try {
					notify(controller, encoder, provider)

					const eventStream = getEventStream(prompt, provider)

					for await (const event of eventStream) {
						// console.log(`event - ${event.event}`)

						if (event.event !== 'on_chat_model_stream') continue

						const content = event.data?.chunk?.content
						if (!content || typeof content !== 'string') continue

						for (const char of content) {
							controller.enqueue(encoder.encode(char))
							await new Promise((r) => setTimeout(r, streamSpeed))
						}
					}
					break
				} catch (err: any) {
					const is429 = err?.statusCode === 429 || err?.statusText?.includes('Too Many Requests')

					if (is429) {
						console.warn(`${provider} - 429 - falling back to next provider...`)
						continue
					}

					console.error(`Error: ${err?.cause}`)
					controller.error(err)
					return
				}
			}

			controller.close()
		}
	})

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' }
	})
}
