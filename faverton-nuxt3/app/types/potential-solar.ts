export type PVGISData = {
    inputs: Inputs;
    outputs: Outputs;
    meta: Meta;
  };
  
  export type Inputs = {
    location: Location;
    meteo_data: MeteoData;
    mounting_system: MountingSystem;
    pv_module: PVModule;
    economic_data: EconomicData;
  };
  
  export type Location = {
    latitude: number;
    longitude: number;
    elevation: number;
  };
  
  export type MeteoData = {
    radiation_db: string;
    meteo_db: string;
    year_min: number;
    year_max: number;
    use_horizon: boolean;
    horizon_db: string;
  };
  
  export type MountingSystem = {
    fixed: {
      slope: {
        value: number;
        optimal: boolean;
      };
      azimuth: {
        value: number;
        optimal: boolean;
      };
      type: string;
    };
  };
  
  export type PVModule = {
    technology: string;
    peak_power: number;
    system_loss: number;
  };
  
  export type EconomicData = {
    system_cost: number | null;
    interest: number | null;
    lifetime: number | null;
  };
  
  export type Outputs = {
    monthly: {
      fixed: MonthlyData[];
    };
    totals: {
      fixed: TotalsData;
    };
  };
  
  export type MonthlyData = {
    month: number;
    E_d: number;
    E_m: number;
    "H(i)_d": number;
    "H(i)_m": number;
    SD_m: number;
  };
  
  export type TotalsData = {
    E_d: number;
    E_m: number;
    E_y: number;
    "H(i)_d": number;
    "H(i)_m": number;
    "H(i)_y": number;
    SD_m: number;
    SD_y: number;
    l_aoi: number;
    l_spec: string;
    l_tg: number;
    l_total: number;
  };
  
  export type Meta = {
    inputs: MetaInputs;
    outputs: MetaOutputs;
  };
  
  export type MetaInputs = {
    location: MetaLocation;
    meteo_data: MetaMeteoData;
    mounting_system: MetaMountingSystem;
    pv_module: MetaPVModule;
    economic_data: MetaEconomicData;
  };
  
  export type MetaLocation = {
    description: string;
    variables: {
      latitude: MetaVariable;
      longitude: MetaVariable;
      elevation: MetaVariable;
    };
  };
  
  export type MetaMeteoData = {
    description: string;
    variables: {
      radiation_db: MetaVariable;
      meteo_db: MetaVariable;
      year_min: MetaVariable;
      year_max: MetaVariable;
      use_horizon: MetaVariable;
      horizon_db: MetaVariable;
    };
  };
  
  export type MetaMountingSystem = {
    description: string;
    choices: string;
    fields: {
      slope: MetaVariable;
      azimuth: MetaVariable;
    };
  };
  
  export type MetaPVModule = {
    description: string;
    variables: {
      technology: MetaVariable;
      peak_power: MetaVariable;
      system_loss: MetaVariable;
    };
  };
  
  export type MetaEconomicData = {
    description: string;
    variables: {
      system_cost: MetaVariable;
      interest: MetaVariable;
      lifetime: MetaVariable;
    };
  };
  
  export type MetaVariable = {
    description: string;
    units?: string;
  };
  
  export type MetaOutputs = {
    monthly: MetaMonthly;
    totals: MetaTotals;
  };
  
  export type MetaMonthly = {
    type: string;
    timestamp: string;
    variables: {
      E_d: MetaVariable;
      E_m: MetaVariable;
      "H(i)_d": MetaVariable;
      "H(i)_m": MetaVariable;
      SD_m: MetaVariable;
    };
  };
  
  export type MetaTotals = {
    type: string;
    variables: {
      E_d: MetaVariable;
      E_m: MetaVariable;
      E_y: MetaVariable;
      "H(i)_d": MetaVariable;
      "H(i)_m": MetaVariable;
      "H(i)_y": MetaVariable;
      SD_m: MetaVariable;
      SD_y: MetaVariable;
      l_aoi: MetaVariable;
      l_spec: MetaVariable;
      l_tg: MetaVariable;
      l_total: MetaVariable;
    };
  };
  