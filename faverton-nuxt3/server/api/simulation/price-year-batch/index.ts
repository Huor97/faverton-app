import { serverSupabaseClient } from '#supabase/server';

const EDF_PRICE = 0.1269;

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const client = await serverSupabaseClient(event);

  if (!body.simulations || !Array.isArray(body.simulations)) {
    return {
      error: 'Format invalide: \'simulations\' array requis',
      status: 400,
    };
  }

  const results: Record<string, unknown> = {};

  // Traiter toutes les simulations en parallèle
  await Promise.all(
    body.simulations.map(async (sim: Record<string, unknown>) => {
      const surfaceArea = Number(sim.surface);
      const panelEfficiency = Number(sim.panelEfficiency);
      const solarEnergyId = String(sim.solarEnergyId);

      if (isNaN(surfaceArea) || surfaceArea === 0
        || isNaN(panelEfficiency) || !solarEnergyId) {
        results[solarEnergyId] = { error: 'Paramètres invalides' };
        return;
      }
      const highPerformancePanel = Math.round((panelEfficiency / 100) * 100) / 100;

      try {
        const { data: solarEnergy } = await client
          .from('solar_energy')
          .select('yearly_energy')
          .eq('solar_energy_id', solarEnergyId)
          .single();

        if (!solarEnergy?.yearly_energy) {
          results[solarEnergyId] = { error: 'Données solaires non trouvées' };
          return;
        }

        const amountEurosPerYear = solarEnergy.yearly_energy * surfaceArea * EDF_PRICE * highPerformancePanel;

        results[solarEnergyId] = {
          yearlyEnergy: solarEnergy.yearly_energy,
          surfaceArea,
          amountEurosPerYear: amountEurosPerYear,
        };
      }
      catch {
        results[solarEnergyId] = { error: 'Erreur de traitement' };
      }
    }),
  );

  return results;
});
