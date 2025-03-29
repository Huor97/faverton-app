export interface AmountEurosPerMonths {
  surfaceArea: number
  panelEfficiency: number
  monthlyResults: MonthlyResult[]
}

export interface MonthlyResult {
  month: string
  energy: number
  euros: number
}
