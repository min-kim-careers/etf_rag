import { EMBEDDING_URL } from '$env/static/private'
import { OllamaEmbeddings } from '@langchain/ollama'

const embeddings = new OllamaEmbeddings({
	model: 'nomic-embed-text',
	baseUrl: EMBEDDING_URL
})

export async function embedQuery(text: string): Promise<number[]> {
	return embeddings.embedQuery(text)
}
