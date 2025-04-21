import type { PVGISData } from "~~/shared/types/jrc-potential-solar";

export function useFetchJrc(latitude: Ref<number | null>, longitude: Ref<number | null>) {
  const hasValidCoordinates = computed(() => {
    return typeof latitude.value === `number`
      && typeof longitude.value === `number`;
  });
  const { data, status, error, refresh } = useAsyncData<PVGISData | null>(
    () => $fetch<PVGISData>(`/api/solar-potential/jrc`, {
      query: {
        lat: latitude.value,
        lon: longitude.value,
      },
    }), {
      watch: [latitude, longitude],
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
