export type Feature = {
  features: PropertiesAddress[]
  type: string
  geometry: {
    type: string
    coordinates: [number, number]
  }
};

export type PropertiesAddress = {
  properties: Address
};

export type Address = {
  label: string
  score: number
  id: string
  banId: string
  type: string
  name: string
  postcode: string
  citycode: string
  x: number
  y: number
  population: number
  city: string
  context: string
  importance: number
  municipality: string
};
