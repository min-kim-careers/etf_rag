import { streamModel } from '$lib/utils/langchain/config'

export const POST = async ({ request }) => {
	const { prompt } = await request.json()

	let modelStream
	try {
		modelStream = await streamModel(prompt)
	} catch (err: any) {
		if (err.code === 429 || err.status === 429) {
			throw new Error(`Rate limit reached: ${err}`)
		}
		throw new Error(`Error creating response stream: ${err}`)
	}

	const encoder = new TextEncoder()
	const body = new ReadableStream({
		async start(controller) {
			try {
				for await (const chunk of modelStream) {
					const text = chunk[0].content
					if (text && typeof text === 'string') {
						for (const char of text) {
							controller.enqueue(encoder.encode(char))
							await new Promise((r) => setTimeout(r, 15))
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
