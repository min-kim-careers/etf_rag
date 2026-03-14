import Papa from 'papaparse'

export async function extractCsvRows(file: File) {
	return new Promise((resolve) => {
		Papa.parse(file, {
			header: true,
			transformHeader: (h) => h.toLowerCase(),
			skipEmptyLines: true,
			complete: (results) => resolve(results.data || null),
			error: () => resolve(null)
		})
	})
}
