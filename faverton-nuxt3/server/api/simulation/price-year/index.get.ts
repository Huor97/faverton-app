import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const client = await serverSupabaseClient(event);
  const EDF_PRICE = 0.1269;

  const surfaceArea = Number(query.surface);
  const panelEfficiency = query.panelEfficiency ? Number(query.panelEfficiency) : null;
  const solarEnergyId = query.solarEnergyId ? String(query.solarEnergyId) : null;

  if (isNaN(surfaceArea) || surfaceArea == 0 || panelEfficiency === null || isNaN(panelEfficiency) || !solarEnergyId) {
    return {
      error: `Paramètres invalides`,
      status: 400,
    };
  }

  const HIGH_PERFORMANCE_PANEL = Number((panelEfficiency / 100).toFixed(2));

  const { data: solarEnergy, error: yearlyEnergyError } = await client
    .from(`solar_energy`)
    .select(`yearly_energy`)
    .eq(`solar_energy_id`, solarEnergyId)
    .single();

  if (yearlyEnergyError) {
    throw createError({
      statusCode: 500,
      statusMessage: `Erreur lors de la récupération de la donnée`,
    });
  }

  if (!solarEnergy || solarEnergy.yearly_energy === null) {
    throw createError({
      statusCode: 404,
      statusMessage: `solar energy non trouvée`,
    });
  }

  const amountEurosPerYear = solarEnergy.yearly_energy * surfaceArea * EDF_PRICE * HIGH_PERFORMANCE_PANEL;

  return {
    yearlyEnergy: solarEnergy.yearly_energy,
    surfaceArea,
    amountEurosPerYear,
  };
});
