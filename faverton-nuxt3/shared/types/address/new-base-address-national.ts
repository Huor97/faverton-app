export interface NewFeatureCollection {
  name: string
  featureCollection: FeatureCollection
}

export interface FeatureCollection {
  type: string
  features: Feature[]
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
  postcode: string
  city: string
}
