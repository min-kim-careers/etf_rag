import type { Event } from '$lib/types/event'
import type { Order } from '$lib/types/order'

export const makeEvent = (
	symbol: string,
	buy: Order,
	sell: Order,
	disposedQuantity: number
): Event => ({
	symbol,
	acquiredDate: buy.date,
	acquiredFee: buy.fee,
	acquiredPrice: buy.price,

	disposedQuantity,

	disposedDate: sell.date,
	disposedFee: sell.fee,
	disposedPrice: sell.price,

	gainloss: Math.round((sell.price - buy.price) * disposedQuantity - (sell.fee + buy.fee))
})
