import { GEMINI_API_KEY } from '$env/static/private'
import { getProductCategoriesTool } from '$lib/utils/langchain/tools'
import { ChatGoogle } from '@langchain/google'
import { createAgent } from 'langchain'

const model = 'gemini-2.0-flash-lite'

const llm = new ChatGoogle({
	model,
	apiKey: GEMINI_API_KEY
})

const agent = createAgent({
	model: llm,
	tools: [getProductCategoriesTool],
	systemPrompt: 'You are a helpful ETF research assistant.'
})

export const streamModel = async (prompt: string) => {
	try {
		return await agent.stream(
			{ messages: [{ role: 'user', content: prompt }] },
			{ streamMode: 'messages' }
		)
	} catch (error) {
		const err = error as any
		console.error(`Error code: ${err.statusCode} - ${err.statusText}`)
		throw new Error('Error streaming model')
	}
}
