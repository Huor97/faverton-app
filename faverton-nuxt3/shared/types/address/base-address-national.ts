export interface FeatureCollection {
  type: string
  version: string
  features: Feature[]
  attribution: string
  licence: string
  query: string
  limit: number
}

export interface Feature {
  type: string
  geometry: Geometry
  properties: Properties
}

export interface Geometry {
  type: string
  coordinates: number[]
}

export interface Properties {
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
  population?: number
  city: string
  context: string
  importance: number
  municipality?: string
  street?: string
}
