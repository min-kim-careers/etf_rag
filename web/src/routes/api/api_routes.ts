export const API_ROUTES = {
	auth: {
		signout: '/api/auth/signout'
	},
	chat: {
		stream: '/api/chat/stream',
		ping: '/api/chat/ping'
	},
	product: {
		query: '/api/product/query',
		categories: '/api/product/categories'
	}
} as const
