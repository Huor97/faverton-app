import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);

  const { data: { user }, error: authError } = await client.auth.getUser();

  if (authError || !user) {
    return { success: false, error: `User not authenticated` };
  }

  const { data: simulationData, error: simulationError } = await client
    .from(`simulation`)
    .select(`
      *,
      panel (*),
      solar_energy (*)
    `)
    .eq(`history`, true)
    .eq(`user_id`, user?.id);

  if (simulationError) {
    throw createError({
      statusCode: 500,
      statusMessage: `Error retrieving simulation`,
    });
  }

  if (!simulationData || simulationData.length === 0) {
    return {
      simulations: [],
    };
  }

  return {
    simulations: simulationData,
  };
});
