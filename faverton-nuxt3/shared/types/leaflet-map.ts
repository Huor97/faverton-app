import type L from 'leaflet';

export interface DrawControlOptions extends L.Control.DrawOptions {
  draw: {
    polygon?: L.DrawOptions.PolygonOptions
    polyline?: boolean
    rectangle?: boolean
    circle?: boolean
    marker?: boolean
    circlemarker?: boolean
  }
}
