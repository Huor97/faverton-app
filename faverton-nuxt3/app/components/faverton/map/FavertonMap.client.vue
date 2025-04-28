<script setup lang="ts">
import L from 'leaflet';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import type { DrawMap, LatLngExpression } from 'leaflet';
import type { FeatureCollection } from "~~/shared/types/address/new-base-address-national";

const addressStore = useAddressStore();
const mapStore = useMapStore();

const featureCollection = computed<FeatureCollection | null>(() => {
  return addressStore.savedAddress?.featureCollection || null;
});

let leafletMap: L.Map | null = null;
let drawControl: L.Control.Draw | null = null;
let drawnItems: L.FeatureGroup | null = null;
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

watch(() => featureCollection.value, (newAddress) => {
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

const onMapReady = (mapInstance: L.Map) => {
  leafletMap = mapInstance;
  isMapReady.value = true;

  if (import.meta.client) {
    drawnItems = new L.FeatureGroup();
    mapInstance.addLayer(drawnItems);
    drawControl = new L.Control.Draw({
      position: `topright`,
      draw: {
        polygon: {
          shapeOptions: {
            color: `#ff0000`,
            fillColor: `#ff0000`,
            fillOpacity: 0.2,
            weight: 2,
          },
        },
        // FIXME: how to disable these options with other solution?
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
      // Clear all existing layers to enforce a single-polygon constraint.
      drawnItems?.clearLayers();
      const layer = e.layer;
      drawnItems?.addLayer(layer);
      // @ts-expect-error Leaflet Draw layer type is not properly typed for getLatLngs
      const area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
      const roundedArea = Math.round(area);
      mapStore.setDrawnArea(roundedArea);
      layer.bindTooltip(`Superficie: ${roundedArea} m²`, { permanent: true, direction: `center` });
    });

    mapInstance.on(`draw:deleted`, () => {
      mapStore.setDrawnArea(0);
    });

    mapInstance.on(`draw:editstop`, () => {
      if (drawnItems?.getLayers().length === 0) {
        mapStore.setDrawnArea(0);
      }
      else {
        const layer = drawnItems?.getLayers()[0];
        // @ts-expect-error Leaflet Draw layer type
        const area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
        const roundedArea = Math.round(area);
        mapStore.setDrawnArea(roundedArea);
      }
    });
  }
};

watch(() => mapStore.activateDrawing, (activate) => {
  if (activate && leafletMap && drawControl) {
    const drawOptions = (drawControl.options as DrawControlOptions).draw || {};
    const polygonOptions = drawOptions.polygon || { allowIntersection: true, showArea: true };
    drawOptions.polygon = polygonOptions;
    new L.Draw.Polygon(leafletMap as DrawMap, polygonOptions).enable();
    mapStore.resetDrawing();
  }
}, { immediate: true });
</script>

<template>
  <LMap
    style="height: 100vh"
    :zoom="6"
    :center="[46, 10]"
    :use-global-leaflet="true"
    :options="{ zoomControl: false }"
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
    <LControlLayers position="bottomright" />
    <LControlZoom position="topright" />
    <LCircle
      v-if="featureCollection?.features[0]?.geometry?.coordinates"
      :lat-lng="getCoordinates(featureCollection)"
      :radius="500"
      :options="{
        color: '#3388ff',
        fillColor: '#3388ff',
        fillOpacity: 0.2,
        weight: 2,
      }"
    >
      <LPopup>
        Code postal: {{ featureCollection?.features[0]?.properties?.postcode }}
      </LPopup>
    </LCircle>
  </LMap>
</template>
