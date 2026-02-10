export const APP_ROUTES = {
	auth: {
		login: '/auth/login',
		logout: '/auth/logout',
		signup: '/auth/signup'
	},
	home: '/home',
	profile: {
		create: '/profile/create'
	}
} as const
