import { serverSupabaseClient } from '#supabase/server';
import { SOLAR_DEFAULTS } from '~~/shared/constants/solar-parameters';

export default defineEventHandler (async (event) => {
  try {
    const body = await readBody(event);
    const client = await serverSupabaseClient(event);

    if (!body.postalCode || !body.city) {
      throw createError({
        statusCode: 400,
        message: 'Postal code and city are required',
      });
    }

    // Inclus tilt (inclinaison) et azimuth (orientation)
    const solarPotentialData = {
      postal_code: body.postalCode,
      city: body.city,
      month_1_energy: body.month1Energy,
      month_2_energy: body.month2Energy,
      month_3_energy: body.month3Energy,
      month_4_energy: body.month4Energy,
      month_5_energy: body.month5Energy,
      month_6_energy: body.month6Energy,
      month_7_energy: body.month7Energy,
      month_8_energy: body.month8Energy,
      month_9_energy: body.month9Energy,
      month_10_energy: body.month10Energy,
      month_11_energy: body.month11Energy,
      month_12_energy: body.month12Energy,
      yearly_energy: body.yearlyEnergy,
      tilt_angle: body.tiltAngle ?? SOLAR_DEFAULTS.INCLINATION,
      azimuth: body.azimuth ?? SOLAR_DEFAULTS.AZIMUT,
    };

    // Vérifier si l'entrée existe déjà avec les mêmes paramètres d'installation
    const { data: existingData, error: checkError } = await client
      .from('solar_energy')
      .select('solar_energy_id')
      .eq('postal_code', solarPotentialData.postal_code)
      .eq('city', solarPotentialData.city)
      .eq('tilt_angle', solarPotentialData.tilt_angle)
      .eq('azimuth', solarPotentialData.azimuth)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw createError({
        statusCode: 500,
        message: checkError.message,
      });
    }

    let result;

    // Si l'entrée n'existe pas, l'insérer
    if (!existingData) {
      const { data, error } = await client
        .from('solar_energy')
        .insert(solarPotentialData)
        .select('solar_energy_id');

      if (error) {
        throw createError({
          statusCode: 500,
          message: error.message,
        });
      }

      result = {
        success: true,
        message: 'Solar data inserted successfully',
        solarEnergyId: data[0].solar_energy_id,
      };
    }
    else {
      // Si l'entrée existe déjà, retourner un message
      result = {
        success: true,
        message: 'Existing data for this location',
        solarEnergyId: existingData.solar_energy_id,
      };
    }

    return result;
  }
  catch (error: unknown) {
    console.error('Error while saving solar data:', error);
    if (error instanceof Error && !('statusCode' in error)) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Server error while saving data',
      });
    }
    throw error;
  }
});
