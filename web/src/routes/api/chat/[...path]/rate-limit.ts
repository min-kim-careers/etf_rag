import { sql } from '$lib/utils/db/postgres'

const RATE_LIMIT = 10

export async function getRemainingLimit(sessionId: string) {
	const row = await sql`
    SELECT count
    FROM llm_usage
    WHERE session_id = ${sessionId}
    AND date = CURRENT_DATE
    `
	return RATE_LIMIT - (row[0]?.count ?? 0)
}

export async function checkRemainingLimit(sessionId: string) {
	const remaining = await getRemainingLimit(sessionId)

	if (remaining <= 0) return { allowed: false, remaining: 0 }

	await sql`
    INSERT INTO llm_usage (session_id, date, count)
    VALUES (${sessionId}, CURRENT_DATE, 1)
    ON CONFLICT (session_id, date)
    DO UPDATE SET count = llm_usage.count + 1
    `

	return { allowed: true, remaining: remaining - 1 }
}
