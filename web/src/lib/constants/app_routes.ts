export const APP_ROUTES = {
	auth: {
		login: '/auth/login',
		signup: '/auth/signup'
	},
	home: '/',
	profile: {
		create: '/profile/create'
	},
	signout: '/signout'
} as const
