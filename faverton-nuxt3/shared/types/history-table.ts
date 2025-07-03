export interface SimulationHistoryTable {
  $id: string
  historyList: HistoryList
}

export interface HistoryList {
  simulations: Simulation[]
}

export interface Simulation {
  simulation_id: string
  simulation_date: Date
  solar_energy_id: string
  panel_id: string
  user_id: string
  history: boolean
  surface: number
  updated_at: Date
  panel: Panel
  solar_energy: SolarEnergy
}

export interface Panel {
  model: string
  detail: string
  company: string
  country: string
  panel_id: string
  efficiency: number
  panel_type_id: string
}

export interface SolarEnergy {
  city: string
  azimuth: number
  tilt_angle: number
  updated_at: Date
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
