import z from 'zod'

export const BaseSchema = z.object({
	limit: z.number().min(1).max(50).optional()
})
