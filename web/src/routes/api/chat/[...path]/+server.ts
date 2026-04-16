import { streamChat } from './handle-chat'

export const POST = async ({ request, params }) => {
	switch (params.path) {
		case 'stream':
			const stream = await streamChat(request)
			return stream

		default:
			break
	}
}
