import z from 'zod'

export const schema = z.object({
	name: z.string({ message: 'Name required' }).nonempty({ message: 'Name required' })
})

export type Schema = z.infer<typeof schema>
