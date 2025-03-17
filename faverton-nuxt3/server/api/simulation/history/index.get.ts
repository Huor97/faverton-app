import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);

  const { data: simulationsData, error: simulationError } = await client
    .from(`simulation`)
    .select(`
      *,
      panel (*),
      solar_energy (*)
    `)
    .eq(`history`, true); // Filtre sur history = true

  if (simulationError) {
    throw createError({
      statusCode: 500,
      statusMessage: `Erreur lors de la récupération des simulations`,
    });
  }

  if (!simulationsData || simulationsData.length === 0) {
    return {
      simulations: [],
    };
  }

  return {
    simulations: simulationsData,
  };
});
