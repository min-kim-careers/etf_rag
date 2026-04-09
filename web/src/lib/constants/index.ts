import { PUBLIC_APP_TITLE } from '$env/static/public'

export const APP_DATA = {
	title: PUBLIC_APP_TITLE
} as const

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
