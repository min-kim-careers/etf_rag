import type { Order } from '$lib/types/order'

export function sortOrders(orders: Order[]) {
	return structuredClone(orders).sort(
		(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
	)
}
