import { ENV } from '$lib/constants/app-env'
import { getProductFilters } from '$lib/utils/langchain/tools/get-product-filters'
import { getProductsByFilter } from '$lib/utils/langchain/tools/get-products-by-filter'
import { getProductsBySemantics } from '$lib/utils/langchain/tools/get-products-by-semantics'
import { ChatGoogle } from '@langchain/google'
import { ChatOpenAI } from '@langchain/openai'
import { createAgent } from 'langchain'

const CLOUD_MODEL = 'gemini-2.5-flash-lite'

const SYSTEM_PROMPT = `
	You are an ETF assistant. When asked to list or find ETFs, always call the available tools immediately. Never ask clarifying questions before calling a tool. Output results as tables.
	`

const TOOLS = [getProductsBySemantics, getProductsByFilter, getProductFilters]

export const cloudAgent = createAgent({
	model: new ChatGoogle({
		model: CLOUD_MODEL,
		apiKey: ENV.GEMINI_API_KEY
	}),
	tools: TOOLS,
	systemPrompt: SYSTEM_PROMPT
})

export const localAgent = createAgent({
	model: new ChatOpenAI({
		apiKey: 'not-needed',
		configuration: {
			baseURL: `${ENV.LOCAL_LLM_URL}/v1`
		}
	}),
	tools: TOOLS,
	systemPrompt: SYSTEM_PROMPT
})
