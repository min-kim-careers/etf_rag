import { GEMINI_API_KEY } from '$env/static/private'
import { ChatGoogle } from '@langchain/google'
import { ChatOpenAI } from '@langchain/openai'
import { createAgent } from 'langchain'
import { getProductCategoriesTool } from './tools'

export const cloudAgent = createAgent({
	model: new ChatGoogle({
		model: 'gemini-2.0-flash-lite',
		apiKey: GEMINI_API_KEY
	}),
	tools: [getProductCategoriesTool],
	systemPrompt: 'You are a helpful ETF research assistant.'
})

export const localAgent = createAgent({
	model: new ChatOpenAI({
		apiKey: 'not-needed',
		configuration: {
			baseURL: 'http://192.168.8.170:11434/v1'
		},
		modelName: 'llama3.1',
		temperature: 0.7,
		maxTokens: 8192
	}),
	tools: [getProductCategoriesTool],
	systemPrompt: 'You are a helpful ETF research assistant.'
})
