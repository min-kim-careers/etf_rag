export type Product = {
	asxCode: string
	type: string
	issuer: string | null
	fundName: string
	category: string
	region: string
	merPa: number | null
	fumM: number | null
	fumMChange: number | null
	fundsInflowOutflowM: number | null
	twelveMFundsInflowOutflowM: number | null
	chessFumM: number | null
	chessFumMChange: number | null
	chessFundsInflowOutflowM: number | null
	twelveMChessFundsInflowOutflowM: number | null
	transactedValue: number | null
	transactedVolume: number | null
	numberOfTrades: number | null
	monthlyLiquidity: number | null
	spread: number | null
	last: number | null
	historicalDistributionYield: number | null
	oneMonthTotalReturn: number | null
	oneYearTotalReturn: number | null
	threeYearTotalReturnAnn: number | null
	fiveYearTotalReturnAnn: number | null
}
