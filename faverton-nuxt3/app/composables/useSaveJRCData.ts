import type { PVGISData } from "~~/shared/types/jrc-potential-solar";

export async function useSaveJRCDataToFaverton(jrcData: Ref<PVGISData | null>, postalCode: Ref<string | null>, city: Ref<string | null>) {
  if (!jrcData.value || !postalCode?.value || !city?.value) {
    console.error(`Missing location information`);
    return null;
  }

  const dataToSave = {
    postalCode: postalCode.value,
    city: city.value,
    month1Energy: jrcData.value?.outputs.monthly.fixed[0]?.E_m,
    month2Energy: jrcData.value?.outputs.monthly.fixed[1]?.E_m,
    month3Energy: jrcData.value?.outputs.monthly.fixed[2]?.E_m,
    month4Energy: jrcData.value?.outputs.monthly.fixed[3]?.E_m,
    month5Energy: jrcData.value?.outputs.monthly.fixed[4]?.E_m,
    month6Energy: jrcData.value?.outputs.monthly.fixed[5]?.E_m,
    month7Energy: jrcData.value?.outputs.monthly.fixed[6]?.E_m,
    month8Energy: jrcData.value?.outputs.monthly.fixed[7]?.E_m,
    month9Energy: jrcData.value?.outputs.monthly.fixed[8]?.E_m,
    month10Energy: jrcData.value?.outputs.monthly.fixed[9]?.E_m,
    month11Energy: jrcData.value?.outputs.monthly.fixed[10]?.E_m,
    month12Energy: jrcData.value?.outputs.monthly.fixed[11]?.E_m,
    yearlyEnergy: jrcData.value?.outputs.totals.fixed.E_y,
  };

  try {
    const result = await $fetch<SolarEnergyResponse>(`/api/solar-potential/faverton`, {
      method: `POST`,
      body: dataToSave,
    });

    return {
      solarEnergyId: ref(result),
      error: null,
      status: `success`,
    };
  }
  catch (error) {
    console.error(`Error saving JRC data in Faverton`, error);
    return {
      solarEnergyId: null,
      error: error,
      status: `error`,
    };
  }
};
