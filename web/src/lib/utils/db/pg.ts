import { DB_URL } from '$env/static/private'
import { Pool } from 'pg'

export const dbPool = new Pool({
	connectionString: DB_URL
})
