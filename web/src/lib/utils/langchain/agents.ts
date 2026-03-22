import { GEMINI_API_KEY } from '$env/static/private'
import { ChatGoogle } from '@langchain/google'
import { ChatOllama } from '@langchain/ollama'
import { createAgent } from 'langchain'
import { getProductCategoriesTool } from './tools'

export const geminiAgent = createAgent({
	model: new ChatGoogle({
		model: 'gemini-2.0-flash-lite',
		apiKey: GEMINI_API_KEY
	}),
	tools: [getProductCategoriesTool],
	systemPrompt: 'You are a helpful ETF research assistant.'
})

export const ollamaAgent = createAgent({
	model: new ChatOllama({
		baseUrl: 'http://192.168.8.170:11434',
		model: 'llama3.1:8b',
		temperature: 0.7,
		numCtx: 8192
	}),
	tools: [getProductCategoriesTool],
	systemPrompt: 'You are a helpful ETF research assistant.'
})
