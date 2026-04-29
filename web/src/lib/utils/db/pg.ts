import { ENV } from '$lib/constants/app-env'
import { Pool } from 'pg'

export const dbPool = new Pool({
	connectionString: ENV.DB_URL
})
