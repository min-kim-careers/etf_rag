export function reverseObject(o: object) {
	return Object.fromEntries(Object.entries(o).map(([k, v]) => [v, k]))
}
