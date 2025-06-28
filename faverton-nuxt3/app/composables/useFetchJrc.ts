import type { PVGISData } from "~~/shared/types/jrc-potential-solar";
import { SOLAR_DEFAULTS } from "~~/shared/constants/solar-parameters";

export function useFetchJrc(
  latitude: Ref<number | null>,
  longitude: Ref<number | null>,
  inclination: Ref<number> = ref(SOLAR_DEFAULTS.INCLINATION),
  azimut: Ref<number> = ref(SOLAR_DEFAULTS.AZIMUT),
) {
  const hasValidCoordinates = computed(() => {
    return typeof latitude.value === `number`
      && typeof longitude.value === `number`;
  });

  const { data, status, error, refresh } = useAsyncData<PVGISData | null>(
    () => $fetch<PVGISData>(`/api/solar-potential/jrc`, {
      query: {
        lat: latitude.value,
        lon: longitude.value,
        angle: inclination.value,
        aspect: azimut.value,
      },
    }), {
      watch: [latitude, longitude, inclination, azimut],
      server: false,
      immediate: hasValidCoordinates.value,
    },
  );

  return {
    data,
    status,
    error,
    refresh,
  };
}
