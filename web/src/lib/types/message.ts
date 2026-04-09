type Role = 'user' | 'agent'

export type Message = {
	role: Role
	content: string
}
