import { GEMINI_API_KEY } from '$env/static/private'
import { ChatGoogle } from '@langchain/google'
import { createAgent } from 'langchain'

const model = 'gemini-2.5-flash-lite'

const llm = new ChatGoogle({
	model,
	apiKey: GEMINI_API_KEY
})

const agent = createAgent({
	model: llm
})

export const streamModel = async (prompt: string) => {
	return await agent.stream(
		{ messages: [{ role: 'user', content: prompt }] },
		{ streamMode: 'messages' }
	)
}
