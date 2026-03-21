import { streamModel } from '$lib/utils/langchain/config'
import { ToolMessage } from 'langchain'

const streamSpeed = 10

export const POST = async ({ request }) => {
	const { prompt } = await request.json()

	let modelStream = await streamModel(prompt)

	const encoder = new TextEncoder()
	const body = new ReadableStream({
		async start(controller) {
			try {
				for await (const chunk of modelStream) {
					const message = chunk[0]

					if (message instanceof ToolMessage) continue

					// // log everything
					// console.log('TYPE:', message?.constructor?.name)
					// console.log('CONTENT TYPE:', typeof message?.content)
					// console.log('CONTENT:', JSON.stringify(message?.content)?.slice(0, 100))
					// console.log('---')

					const content = message.content
					if (!content || typeof content !== 'string') continue

					for (const char of content) {
						controller.enqueue(encoder.encode(char))
						await new Promise((r) => setTimeout(r, streamSpeed))
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
