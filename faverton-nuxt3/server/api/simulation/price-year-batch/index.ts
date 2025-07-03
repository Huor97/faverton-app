import { serverSupabaseClient } from '#supabase/server';

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

        // Utiliser la même logique que l'API de recalcul pour la cohérence
        const efficiency = panelEfficiency / 100;
        const basePowerPerM2 = 0.2; // kWp/m² pour 20% d'efficacité
        const installedPowerKWp = surfaceArea * basePowerPerM2 * (efficiency / 0.2);

        // Production ajustée : yearly_energy de la DB représente kWh/kWp/an
        const adjustedYearlyEnergy = solarEnergy.yearly_energy * installedPowerKWp;

        // Coût d'installation basé sur la puissance
        const installationCostPerKWp = 2500; // €/kWp
        const amountEurosPerYear = installedPowerKWp * installationCostPerKWp;

        results[solarEnergyId] = {
          yearlyEnergy: Math.round(adjustedYearlyEnergy),
          surfaceArea,
          amountEurosPerYear: Math.round(amountEurosPerYear),
          installedPowerKWp: Math.round(installedPowerKWp * 100) / 100,
        };
      }
      catch {
        results[solarEnergyId] = { error: 'Erreur de traitement' };
      }
    }),
  );

  return results;
});
