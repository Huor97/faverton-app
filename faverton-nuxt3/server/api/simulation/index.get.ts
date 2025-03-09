import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler (async (event) => {
  const query = getQuery(event);

  if (!query.simulationId) {
    throw createError({
      statusCode: 400,
      message: `Zip simulation`,
    });
  }

  const client = await serverSupabaseClient(event);

  const { data: simulationData, error: simulationError } = await client
    .from(`simulation`)
    .select(`
        *,
        panel (*),
        solar_energy (*)
      `)
    .eq(`simulation_id`, query.simulationId as string)
    .single();

  if (simulationError) {
    throw createError({
      statusCode: 500,
      statusMessage: `Erreur lors de la récupération de la simulation`,
    });
  }

  if (!simulationData) {
    throw createError({
      statusCode: 404,
      statusMessage: `Simulation non trouvée`,
    });
  }

  return {
    simulation: simulationData,
  };
});
