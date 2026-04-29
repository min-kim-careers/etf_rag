import type { Message } from '$lib/types/message'
import { cloudAgent, localAgent } from './agents'

export const PROVIDER_LIST = ['cloud', 'local'] as const
export type Provider = (typeof PROVIDER_LIST)[number]

export function getEventStream(messages: Message[], provider: Provider, signal: AbortSignal) {
	const agent = provider === 'cloud' ? cloudAgent : localAgent
	return agent.streamEvents({ messages }, { version: 'v2', signal })
}
