import { tool } from '@langchain/core/tools'

export const getETFListTool = tool(
	async ({}) => {
		return
	},
	{
		name: 'get_ETF_list',
		description: 'Get list of ASX ETFs'
	}
)
