import { GEMINI_API_KEY, LOCAL_LLM_URL } from '$env/static/private'
import { getProductDetailsTool } from '$lib/utils/langchain/tools/get-product-details'
import { getSimilarProductsTool } from '$lib/utils/langchain/tools/get-similar-products'
import { ChatGoogle } from '@langchain/google'
import { ChatOpenAI } from '@langchain/openai'
import { createAgent } from 'langchain'
import { getProductCategoriesTool } from './tools/get-product-categories'

const CLOUD_MODEL = 'gemini-2.0-flash-lite'

const SYSTEM_PROMPT =
	'You are an ETF assistant. When asked to list or find ETFs, always call the available tools immediately. Never ask clarifying questions before calling a tool.'

const TOOLS = [getProductCategoriesTool, getSimilarProductsTool, getProductDetailsTool]

export const cloudAgent = createAgent({
	model: new ChatGoogle({
		model: CLOUD_MODEL,
		apiKey: GEMINI_API_KEY
	}),
	tools: TOOLS,
	systemPrompt: SYSTEM_PROMPT
})

export const localAgent = createAgent({
	model: new ChatOpenAI({
		apiKey: 'not-needed',
		configuration: {
			baseURL: `${LOCAL_LLM_URL}/v1`
		}
	}),
	tools: TOOLS,
	systemPrompt: SYSTEM_PROMPT
})
