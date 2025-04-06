<script setup lang="ts">
import L from 'leaflet';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';

const map = ref<L.Map | null>(null);

const onMapReady = (mapInstance: L.Map) => {
  if (import.meta.client) {
    const drawnItems = new L.FeatureGroup();
    console.log(drawnItems);

    mapInstance.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      draw: {
        polygon: {
          shapeOptions: {
            color: `#ff0000`,
            fillColor: `#ff0000`,
            fillOpacity: 0.2,
            weight: 2,
          },
        },
        // FIXME: how disabled there options?
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: drawnItems,
      },
    });

    mapInstance.addControl(drawControl);
    // @ts-expect-error Leaflet Draw event type mismatch with LeafletEventHandlerFn
    mapInstance.on(`draw:created`, (e: L.DrawEvents.Created) => {
      const layer = e.layer;
      drawnItems.addLayer(layer);
      // @ts-expect-error Leaflet Draw layer type is not properly typed for getLatLngs
      const area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
      layer.bindTooltip(`Superficie: ${area.toFixed(2)} m²`, { permanent: true, direction: `center` });

      console.log(`Superficie: ${area.toFixed(2)} m²`);
    });
  }
};
</script>

<template>
  <LMap
    ref="map"
    style="height: 100vh"
    :zoom="6"
    :center="[47.21322, -1.559482]"
    :use-global-leaflet="true"
    @ready="onMapReady"
  >
    <LTileLayer
      url="https://data.geopf.fr/wmts?&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&TILEMATRIXSET=PM&LAYER={ignLayer}&STYLE={style}&FORMAT={format}&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}"
      :options="{
        ignLayer: 'ORTHOIMAGERY.ORTHOPHOTOS',
        style: 'normal',
        format: 'image/jpeg',
        service: 'WMTS',
        attribution: 'Carte © IGN/Geoplateforme',
        maxNativeZoom: 19,
        maxZoom: 22,
      }"
      layer-type="base"
      name="IGN"
    />
  </LMap>
</template>
