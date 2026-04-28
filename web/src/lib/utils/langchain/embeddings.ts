import { ENV } from '$lib/constants/env'
import { OllamaEmbeddings } from '@langchain/ollama'

const embeddings = new OllamaEmbeddings({
	model: 'nomic-embed-text',
	baseUrl: ENV.OLLAMA_URL
})

export async function embedQuery(text: string): Promise<number[]> {
	return embeddings.embedQuery(text)
}
