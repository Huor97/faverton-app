import { defineStore } from 'pinia';
import type { NewFeatureCollection } from '~~/shared/types/address/new-base-address-national';

export const useAddressStore = defineStore(`address`, () => {
  const savedAddress = ref<NewFeatureCollection | null>(null);

  function setSavedAddress(address: NewFeatureCollection | null) {
    savedAddress.value = address;
  }

  return { savedAddress, setSavedAddress };
});
