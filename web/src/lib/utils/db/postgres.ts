import { DB_URL } from '$env/static/private'
import postgres from 'postgres'

export const sql = postgres(DB_URL)
