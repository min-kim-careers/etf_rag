import { geminiAgent, ollamaAgent } from './agents'

export const providerList = ['gemini', 'ollama'] as const
export type Provider = (typeof providerList)[number]

export function getEventStream(prompt: string, provider: Provider = 'gemini') {
	const agent = provider === 'gemini' ? geminiAgent : ollamaAgent
	return agent.streamEvents({ messages: [{ role: 'user', content: prompt }] }, { version: 'v2' })
}
