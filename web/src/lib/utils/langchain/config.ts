import { cloudAgent, localAgent } from './agents'

export const providerList = ['cloud', 'local'] as const
export type Provider = (typeof providerList)[number]

export function getEventStream(prompt: string, provider: Provider = 'cloud') {
	const agent = provider === 'cloud' ? cloudAgent : localAgent
	return agent.streamEvents({ messages: [{ role: 'user', content: prompt }] }, { version: 'v2' })
}
