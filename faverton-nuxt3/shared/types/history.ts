export interface SimulationResponse {
  simulations: SimulationHistory[]
}

interface SimulationHistory {
  simulation_id: string
  simulation_date: Date
  solar_energy_id: string
  panel_id: string
  user_id: string
  history: boolean
  panel: Panel
  solar_energy?: SimulationSolarEnergy
  surface: number
}

export interface SimulationHistoryItem {
  id?: string
  date?: Date
  surface: number
  panel?: SimulationPanel
  solar_energy?: SimulationSolarEnergy
}

interface SimulationSolarEnergy {
  city: string
  postal_code: string
  yearly_energy: number
  month_1_energy: number
  month_2_energy: number
  month_3_energy: number
  month_4_energy: number
  month_5_energy: number
  month_6_energy: number
  month_7_energy: number
  month_8_energy: number
  month_9_energy: number
  month_10_energy: number
  month_11_energy: number
  month_12_energy: number
  solar_energy_id: string
}

export interface SimulationPanel {
  model: string
  panelEfficiency: number
  panel_id: string
  company: string
  country: string
  detail: string
  panel_type_id: string
}
