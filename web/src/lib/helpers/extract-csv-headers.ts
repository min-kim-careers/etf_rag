import Papa from 'papaparse'

export function extractCsvHeaders(file: File): Promise<string[] | null> {
	return new Promise((resolve) => {
		Papa.parse(file, {
			header: true,
			transformHeader: (h) => h.toLowerCase(),
			preview: 1,
			complete: (results) => resolve(results.meta.fields || null),
			error: () => resolve(null)
		})
	})
}
