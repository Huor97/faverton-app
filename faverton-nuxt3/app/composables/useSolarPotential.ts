import { useQuery } from "@tanstack/vue-query";

export const useSolarPotential = (coordinates: Ref<Array<number>>) => {
  const fetchSolarPotential = async (lat: number, lon: number) => {
    const response = await fetch(`api/solar-potential?lat=${lat}&lon=${lon}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [`solarPotential`, coordinates],
    queryFn: () => {
      const [lon, lat] = unref(coordinates)
      return lat !== undefined && lon !== undefined ?
      fetchSolarPotential(lat, lon) : Promise.resolve({ features: [] })
    },
    enabled: () => unref(coordinates).length >= 2,
  });
  
  return { data, isLoading, error };
};
