import { ENV } from '$lib/constants/env'
import postgres from 'postgres'

export const sql = postgres(ENV.DB_URL)
