export type FeatureCollection = {
  type: "FeatureCollection"
  features: Feature
  version?: string
};

export type Feature = {
  type: "Feature"
  geometry: Point
  properties: Address
}

export type Point = {
  type: "Point"
  coordinates: [number, number]
}

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
