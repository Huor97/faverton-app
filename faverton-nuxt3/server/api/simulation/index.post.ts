import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler (async (event) => {
  try {
    const body = await readBody(event);
    const client = await serverSupabaseClient(event);

    if (!body.solarEnergyId || !body.panelId) {
      throw createError({
        statusCode: 400,
        message: `Zip solar energy id and panel id are required`,
      });
    }

    const simulationData = {
      solar_energy_id: body.solarEnergyId,
      panel_id: body.panelId,
      user_id: body.userId,
      history: false,
      simulation_date: new Date().toISOString(),
    };

    const { data: existingData, error: checkError } = await client
      .from(`simulation`)
      .select(`simulation_id`)
      .eq(`solar_energy_id`, simulationData.solar_energy_id)
      .eq(`panel_id`, simulationData.panel_id)
      .eq(`user_id`, simulationData.user_id)
      .single();

    if (checkError && checkError.code !== `PGRST116`) {
      throw createError({
        statusCode: 500,
        message: checkError.message,
      });
    }

    let result;

    if (!existingData) {
      const { data, error } = await client
        .from(`simulation`)
        .insert(simulationData)
        .select();

      if (error) {
        throw createError({
          statusCode: 500,
          message: error.message,
        });
      }
      result = {
        success: true,
        message: `somulation data inserted successfully`,
        data: data[0],
      };
    }
    else {
      result = {
        success: true,
        message: `Existing data for this location`,
        data: existingData,
      };
    }
    return result;
  }
  catch (error) {
    console.error(`Error while saving simulation data:`, error);
    if (error instanceof Error && !(`statusCode` in error)) {
      throw createError({
        statusCode: 500,
        statusMessage: `Server error while saving data`,
      });
    }
    throw error;
  }
});
