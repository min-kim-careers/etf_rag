import { streamModel } from '$lib/utils/langchain/config'

const streamSpeed = 10

export const POST = async ({ request }) => {
	const { prompt } = await request.json()

	let modelStream = await streamModel(prompt)

	const encoder = new TextEncoder()
	const body = new ReadableStream({
		async start(controller) {
			try {
				for await (const chunk of modelStream) {
					const text = chunk[0].content
					if (text && typeof text === 'string') {
						for (const char of text) {
							controller.enqueue(encoder.encode(char))
							await new Promise((r) => setTimeout(r, streamSpeed))
						}
					}
				}
			} catch (err: any) {
				console.error(`Error streaming from response: ${err}`)
				controller.error(err)
			} finally {
				controller.close()
			}
		}
	})

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8'
		}
	})
}
