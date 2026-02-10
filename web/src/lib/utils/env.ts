interface Env {
	apiUrl: string
	apiKey: string
	apiKeyHeader: string
}

export const env: Env = {
	apiUrl: process.env.API_URL!,
	apiKey: process.env.API_KEY!,
	apiKeyHeader: process.env.API_KEY_HEADER!
} as const
