import type { Panel } from './panel';

export interface SimulationHistoryTable {
  $id: string
  historyList: HistoryList
}

export interface HistoryList {
  simulations: SimulationHistoryTable[]
}

export interface SimulationHistoryTable {
  simulation_id: string
  simulation_date: Date
  solar_energy_id: string
  panel_id: string
  user_id: string
  history: boolean
  panel: Panel
  solar_energy: SolarEnergyHistory
  surface: number
  updated_at: Date
}

export interface SolarEnergyHistory {
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
