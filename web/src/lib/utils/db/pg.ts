import { ENV } from '$lib/constants/env'
import { Pool } from 'pg'

export const dbPool = new Pool({
	connectionString: ENV.DB_URL
})
