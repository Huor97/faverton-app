import { useQuery } from "@tanstack/vue-query";

export const useAddressSearch = (searchTerm: { value: string }) => {
  const fetchAddress = async (address: string) => {
    // const url = `api/address`;
    if (!address || address.length < 3) {
      return { features: [] };
    }
    const response = await fetch(
      `api/address?q=${encodeURIComponent(address)}`,
    );
    return response.json();
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [`searchTerm`, searchTerm],
    queryFn: () => fetchAddress(searchTerm.value),
    enabled: searchTerm.value.length > 3,
  });

  return { data, isLoading, error, refetch };
};
