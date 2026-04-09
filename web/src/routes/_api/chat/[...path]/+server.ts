import { streamChat } from './handle-chat'

export const POST = async ({ request, params }) => {
	switch (params.path) {
		case 'stream':
			return await streamChat(request)

		default:
			break
	}
}
