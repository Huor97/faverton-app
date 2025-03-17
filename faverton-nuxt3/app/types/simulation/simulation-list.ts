export interface SimulationList {
  id: string
  date: Date
  surface: number
  panel: Panel
  solar_energy: SolarEnergy
}

export interface Panel {
  model: string
  panelEfficiency: number
}

export interface SolarEnergy {
  city: string
  postalCode: string
  yearlyEnergy: number
}
