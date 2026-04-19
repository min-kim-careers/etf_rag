import type { Message } from '$lib/types/message'
import { cloudAgent, localAgent } from './agents'

export const providerList = ['cloud', 'local'] as const
export type Provider = (typeof providerList)[number]

export function getEventStream(
	messages: Message[],
	provider: Provider = 'cloud',
	signal?: AbortSignal
) {
	const agent = provider === 'cloud' ? cloudAgent : localAgent
	return agent.streamEvents({ messages }, { version: 'v2', signal })
}
