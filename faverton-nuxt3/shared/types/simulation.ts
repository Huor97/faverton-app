import type { Panel } from "./panel";

export interface Simulations {
  simulations: Simulation[]
}

export interface propertySimulationResult {
  success: boolean
  message: string
  simulation: Simulation
  surface: number
}

export interface propertySimulation {
  success: boolean
  message: string
  simulationId: string
  solarEnergyId: string
  panel: Panel
  surface: number
}

export interface Simulation {
  simulation_id: string
  simulation_date: Date
  solar_energy_id: string
  panel_id: string
  user_id: string
  history: boolean
  panel: Panel
  solar_energy: SolarEnergy
  surface: number
}

export interface SolarEnergy {
  data: SolarProductionData
}

export interface SolarProductionData {
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
