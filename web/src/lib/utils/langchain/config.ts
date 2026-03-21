import { ChatOllama } from '@langchain/ollama'
import { createAgent } from 'langchain'
import { getProductCategoriesTool } from './tools'

const model = 'gemini-2.0-flash-lite'

// const llm = new ChatGoogle({
// 	model,
// 	apiKey: GEMINI_API_KEY
// })

const llm = new ChatOllama({
	baseUrl: 'http://192.168.8.170:11434',
	model: 'llama3.1:8b',
	temperature: 0.7
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
		console.error(error)
		throw new Error('Error streaming model')
	}
}
