import type { CsvRow } from '$lib/types/csv-row'
import Papa from 'papaparse'

export async function extractCsvRows(file: File): Promise<CsvRow[] | null> {
	return new Promise((resolve) => {
		Papa.parse(file, {
			header: true,
			transformHeader: (h) => h.toLowerCase(),
			skipEmptyLines: true,
			complete: (results) => resolve((results.data as CsvRow[]) || null),
			error: () => resolve(null)
		})
	})
}
