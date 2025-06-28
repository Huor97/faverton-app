import { SOLAR_DEFAULTS } from '~~/shared/constants/solar-parameters';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { lat, lon, angle = SOLAR_DEFAULTS.INCLINATION, aspect = SOLAR_DEFAULTS.AZIMUT } = query;
  const url = 'https://re.jrc.ec.europa.eu/api/v5_3/PVcalc';

  if (!lat || !lon) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Latitude and longitude are required',
    });
  }

  // Validation des paramètres optionnels
  const tiltAngle = Number(angle);
  const azimuth = Number(aspect);

  if (tiltAngle < 0 || tiltAngle > 90) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Tilt angle must be between 0 and 90 degrees',
    });
  }

  if (azimuth < -180 || azimuth > 180) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Azimuth must be between -180 and 180 degrees',
    });
  }

  try {
    const response = await $fetch(url, {
      query: {
        lat,
        lon,
        outputformat: 'json',
        raddatabase: 'PVGIS-SARAH3',
        browser: '0',
        peakpower: '1',
        loss: '14',
        mountingplace: 'free',
        pvtechchoice: 'crystSi',
        angle: tiltAngle,
        aspect: azimuth,
        usehorizon: '1',
        userhorizon: '',
        js: '1',
      },
    });

    return response;
  }
  catch (error) {
    console.error('Error fetching solar potential:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching solar potential data',
    });
  }
});
