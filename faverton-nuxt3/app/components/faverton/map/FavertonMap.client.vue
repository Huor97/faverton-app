<script setup lang="ts">
import L from 'leaflet';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import type { DrawMap, LatLngExpression } from 'leaflet';
import type { FeatureCollection } from "~~/shared/types/address/new-base-address-national";

// Configuration des textes français pour Leaflet Draw
const setFrenchDrawTexts = () => {
  Object.assign(L.drawLocal, {
    draw: {
      toolbar: {
        actions: {
          title: `Annuler le dessin`,
          text: `Annuler`,
        },
        finish: {
          title: `Terminer le dessin`,
          text: `Terminer`,
        },
        undo: {
          title: `Supprimer le dernier point dessiné`,
          text: `Supprimer le dernier point`,
        },
        buttons: {
          polyline: `Dessiner une ligne`,
          polygon: `Dessiner un polygone`,
          rectangle: `Dessiner un rectangle`,
          circle: `Dessiner un cercle`,
          marker: `Ajouter un marqueur`,
          circlemarker: `Ajouter un marqueur circulaire`,
        },
      },
      handlers: {
        circle: {
          tooltip: {
            start: `Cliquez et faites glisser pour dessiner un cercle`,
          },
          radius: `Rayon`,
        },
        circlemarker: {
          tooltip: {
            start: `Cliquez sur la carte pour placer un marqueur circulaire`,
          },
        },
        marker: {
          tooltip: {
            start: `Cliquez sur la carte pour placer un marqueur`,
          },
        },
        polygon: {
          error: `<strong>Erreur :</strong> les bords de la forme ne peuvent pas se croiser !`,
          tooltip: {
            start: `Cliquez pour commencer à dessiner une forme`,
            cont: `Cliquez pour continuer à dessiner une forme`,
            end: `Cliquez sur le premier point pour fermer cette forme`,
          },
        },
        polyline: {
          error: `<strong>Erreur :</strong> les bords de la ligne ne peuvent pas se croiser !`,
          tooltip: {
            start: `Cliquez pour commencer à dessiner une ligne`,
            cont: `Cliquez pour continuer à dessiner une ligne`,
            end: `Cliquez sur le dernier point pour terminer la ligne`,
          },
        },
        rectangle: {
          tooltip: {
            start: `Cliquez et faites glisser pour dessiner un rectangle`,
          },
        },
        simpleshape: {
          tooltip: {
            end: `Relâchez la souris pour terminer le dessin`,
          },
        },
      },
    },
    edit: {
      toolbar: {
        actions: {
          save: {
            title: `Enregistrer les modifications`,
            text: `Enregistrer`,
          },
          cancel: {
            title: `Annuler l'édition, annule toutes les modifications`,
            text: `Annuler`,
          },
          clearAll: {
            title: `Effacer toutes les couches`,
            text: `Tout effacer`,
          },
        },
        buttons: {
          edit: `Modifier les couches`,
          editDisabled: `Aucune couche à modifier`,
          remove: `Supprimer les couches`,
          removeDisabled: `Aucune couche à supprimer`,
        },
      },
      handlers: {
        edit: {
          tooltip: {
            text: `Faites glisser les poignées ou les marqueurs pour modifier les formes`,
            subtext: `Cliquez sur Annuler pour annuler les modifications`,
          },
        },
        remove: {
          tooltip: {
            text: `Cliquez sur une forme pour la supprimer`,
          },
        },
      },
    },
  });
};

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
    // Configurer les textes français AVANT de créer le contrôle de dessin
    setFrenchDrawTexts();

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
    <LLayerGroup v-if="featureCollection">
      <LMarker :lat-lng="getCoordinates(featureCollection)">
        <LPopup>
          {{ addressStore.savedAddress?.name || 'Adresse sélectionnée' }}
          <p>
            Coordonnées: {{ getCoordinates(featureCollection) }}
          </p>
        </LPopup>
      </LMarker>
    </LLayerGroup>
  </LMap>
</template>
