export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { lat, lon } = query;
  const url = `https://re.jrc.ec.europa.eu/api/v5_3/PVcalc`;

  if (!lat || !lon) {
    throw createError({
      statusCode: 400,
      statusMessage: `Latitude and longitude are required`,
    });
  }

  try {
    const response = await $fetch(url, {
      query: {
        lat,
        lon,
        outputformat: `json`,
        raddatabase: `PVGIS-SARAH3`,
        browser: `0`,
        peakpower: `1`,
        loss: `14`,
        mountingplace: `free`,
        pvtechchoice: `crystSi`,
        angle: `35`,
        aspect: `0`,
        usehorizon: `1`,
        userhorizon: ``,
        js: `1`,
      },
    });

    return response;
  }
  catch (error) {
    console.error(`Error fetching solar potential:`, error);
    throw createError({
      statusCode: 500,
      statusMessage: `Error fetching solar potential data`,
    });
  }
});
