import { ENV } from '$lib/constants/app-env'
import postgres from 'postgres'

export const sql = postgres(ENV.DB_URL)
