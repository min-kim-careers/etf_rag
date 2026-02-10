import z from 'zod'

export const schema = z.object({
	email: z.email({ message: 'Email required' }),
	password: z.string({ message: 'Password required' }).nonempty({ message: 'Password required' })
})

export type Schema = z.infer<typeof schema>
