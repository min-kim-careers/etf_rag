export const getIp = (request: Request) =>
	request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
