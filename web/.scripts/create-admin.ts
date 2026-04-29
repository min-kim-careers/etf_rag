import { ENV } from '../src/lib/constants/app-env'
import { auth } from '../src/lib/utils/better-auth/server'

async function createAdmin() {
	try {
		await auth.api.signUpEmail({
			body: {
				name: 'ADMIN',
				email: ENV.ADMIN_USER,
				password: ENV.ADMIN_PASSWORD
			}
		})

		console.log('Admin created (or already exists)')
	} catch (err) {
		console.error('Failed:', err)
	}
}

await createAdmin()
