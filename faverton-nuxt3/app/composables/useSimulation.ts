export async function useAddSimulation(responseSolarEnergyId: MaybeRef<string | null>, panelId: MaybeRef<string | null>) {
  const solarEnergyId = unref(responseSolarEnergyId);
  const panelIdRef = unref(panelId);

  if (!solarEnergyId || !panelIdRef) {
    console.error(`Missing location information`);
    return null;
  }
  try {
    const result = await $fetch<propertySimulation>(`/api/simulation`, {
      method: `POST`,
      body: {
        solarEnergyId: responseSolarEnergyId,
        panelId: panelIdRef,
      },
    });

    return result;
  }
  catch (error) {
    console.error(`Error add simulation data`, error);
    return error;
  }
};
