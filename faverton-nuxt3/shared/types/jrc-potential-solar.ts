export interface PVGISData {
  inputs: Inputs
  outputs: Outputs
  meta: Meta
};

export interface Inputs {
  location: Location
  meteo_data: MeteoData
  mounting_system: MountingSystem
  pv_module: PVModule
  economic_data: EconomicData
};

export interface Location {
  latitude: number
  longitude: number
  elevation: number
};

export interface MeteoData {
  radiation_db: string
  meteo_db: string
  year_min: number
  year_max: number
  use_horizon: boolean
  horizon_db: string
};

export interface MountingSystem {
  fixed: {
    slope: {
      value: number
      optimal: boolean
    }
    azimuth: {
      value: number
      optimal: boolean
    }
    type: string
  }
};

export interface PVModule {
  technology: string
  peak_power: number
  system_loss: number
};

export interface EconomicData {
  system_cost: number | null
  interest: number | null
  lifetime: number | null
};

export interface Outputs {
  monthly: {
    fixed: MonthlyData[]
  }
  totals: {
    fixed: TotalsData
  }
};

export interface MonthlyData {
  "month": number
  "E_d": number
  "E_m": number
  "H(i)_d": number
  "H(i)_m": number
  "SD_m": number
};

export interface TotalsData {
  "E_d": number
  "E_m": number
  "E_y": number
  "H(i)_d": number
  "H(i)_m": number
  "H(i)_y": number
  "SD_m": number
  "SD_y": number
  "l_aoi": number
  "l_spec": string
  "l_tg": number
  "l_total": number
};

export interface Meta {
  inputs: MetaInputs
  outputs: MetaOutputs
};

export interface MetaInputs {
  location: MetaLocation
  meteo_data: MetaMeteoData
  mounting_system: MetaMountingSystem
  pv_module: MetaPVModule
  economic_data: MetaEconomicData
};

export interface MetaLocation {
  description: string
  variables: {
    latitude: MetaVariable
    longitude: MetaVariable
    elevation: MetaVariable
  }
};

export interface MetaMeteoData {
  description: string
  variables: {
    radiation_db: MetaVariable
    meteo_db: MetaVariable
    year_min: MetaVariable
    year_max: MetaVariable
    use_horizon: MetaVariable
    horizon_db: MetaVariable
  }
};

export interface MetaMountingSystem {
  description: string
  choices: string
  fields: {
    slope: MetaVariable
    azimuth: MetaVariable
  }
};

export interface MetaPVModule {
  description: string
  variables: {
    technology: MetaVariable
    peak_power: MetaVariable
    system_loss: MetaVariable
  }
};

export interface MetaEconomicData {
  description: string
  variables: {
    system_cost: MetaVariable
    interest: MetaVariable
    lifetime: MetaVariable
  }
};

export interface MetaVariable {
  description: string
  units?: string
};

export interface MetaOutputs {
  monthly: MetaMonthly
  totals: MetaTotals
};

export interface MetaMonthly {
  type: string
  timestamp: string
  variables: {
    "E_d": MetaVariable
    "E_m": MetaVariable
    "H(i)_d": MetaVariable
    "H(i)_m": MetaVariable
    "SD_m": MetaVariable
  }
};

export interface MetaTotals {
  type: string
  variables: {
    "E_d": MetaVariable
    "E_m": MetaVariable
    "E_y": MetaVariable
    "H(i)_d": MetaVariable
    "H(i)_m": MetaVariable
    "H(i)_y": MetaVariable
    "SD_m": MetaVariable
    "SD_y": MetaVariable
    "l_aoi": MetaVariable
    "l_spec": MetaVariable
    "l_tg": MetaVariable
    "l_total": MetaVariable
  }
};
