export const API_ROUTES = {
	auth: {
		signout: '/api/auth/signout'
	},
	chat: {
		stream: '/api/chat/stream',
		limit: '/api/chat/limit'
	},
	product: {
		query: '/api/product/query',
		categories: '/api/product/categories'
	}
} as const
