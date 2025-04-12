<script setup lang="ts">
import L from 'leaflet';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import type { LatLngExpression } from 'leaflet';
import type { FeatureCollection } from "~/types/address/new-base-address-national";

const props = defineProps<{
  savedAddress?: FeatureCollection | null
}>();

let leafletMap: L.Map | null = null;
const isMapReady = ref(false);

const getCoordinates = (address: FeatureCollection): LatLngExpression | null => {
  if (!address?.features[0]?.geometry?.coordinates) return null;
  const [lng, lat] = address.features[0].geometry.coordinates;
  return [lat, lng] as LatLngExpression;
};

const zoomToAddress = (coords: LatLngExpression) => {
  if (!leafletMap || !isMapReady.value) return;

  setTimeout(() => {
    leafletMap?.flyTo(coords, 19, {
      animate: true,
      duration: 1,
    });
  }, 500);
};

watch(() => props.savedAddress, (newAddress) => {
  if (!newAddress) return;

  const coords = getCoordinates(newAddress);
  if (!coords) return;

  if (isMapReady.value) {
    zoomToAddress(coords);
  }
  else {
    const checkMapReady = setInterval(() => {
      if (isMapReady.value) {
        zoomToAddress(coords);
        clearInterval(checkMapReady);
      }
    }, 100);
  }
}, { immediate: true });

// Draw and calculate surface area
const onMapReady = (mapInstance: L.Map) => {
  leafletMap = mapInstance;
  isMapReady.value = true;

  if (import.meta.client) {
    const drawnItems = new L.FeatureGroup();
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
    });
  }
};
</script>

<template>
  <LMap
    style="height: 100vh"
    :zoom="6"
    :center="[46, 10]"
    :use-global-leaflet="true"
    @ready="onMapReady"
  >
    <LTileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      :options="{
        attribution: '&copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors',
        maxZoom: 19,
      }"
      layer-type="base"
      name="Carte"
    />
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
    <LControlLayers />
    <LCircle
      v-if="savedAddress?.features[0]?.geometry?.coordinates"
      :lat-lng="getCoordinates(savedAddress)"
      :radius="500"
      :options="{
        color: '#3388ff',
        fillColor: '#3388ff',
        fillOpacity: 0.2,
        weight: 2,
      }"
    >
      <LPopup>
        Code postal: {{ savedAddress?.features[0]?.properties?.postcode }}
      </LPopup>
    </LCircle>
  </LMap>
</template>
