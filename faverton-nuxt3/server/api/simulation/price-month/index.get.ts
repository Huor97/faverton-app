import { serverSupabaseClient } from "#supabase/server";

interface MonthlyResult {
  month: string
  energy: number
  euros: number
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const client = await serverSupabaseClient(event);

  const EDF_PRICE = 0.1269;
  const MONTH_NAMES = [
    `janvier`, `février`, `mars`, `avril`, `mai`, `juin`,
    `juillet`, `août`, `septembre`, `octobre`, `novembre`, `décembre`,
  ];

  const surfaceArea = Number(query.surface);
  const panelEfficiency = query.panelEfficiency ? Number(query.panelEfficiency) : null;
  const solarEnergyId = query.solarEnergyId ? String(query.solarEnergyId) : null;

  if (isNaN(surfaceArea) || surfaceArea == 0
    || panelEfficiency === null || isNaN(panelEfficiency)
    || !solarEnergyId) {
    return {
      error: `Invalid basic settings`,
      status: 400,
    };
  }

  const HIGH_PERFORMANCE_PANEL = Number((panelEfficiency / 100).toFixed(2));

  try {
    const { data, error } = await client
      .from(`solar_energy`)
      .select(`*`)
      .eq(`solar_energy_id`, solarEnergyId)
      .single();

    if (error) throw error;
    if (!data) throw new Error(`Solar data not found`);

    const monthliesEnergy = data as SolarEnergy;
    const monthlyResults: MonthlyResult[] = [];

    for (let i = 1; i <= 12; i++) {
      const monthKey = `month_${i}_energy` as const;

      if (monthKey in monthliesEnergy) {
        const monthEnergyRef = monthliesEnergy[monthKey as keyof SolarEnergy];

        if (monthEnergyRef !== undefined && !isNaN(Number(monthEnergyRef))) {
          const monthlyEnergy = Number(monthEnergyRef) * surfaceArea * HIGH_PERFORMANCE_PANEL;
          const monthlyEuros = monthlyEnergy * EDF_PRICE;

          monthlyResults.push({
            month: MONTH_NAMES[i - 1],
            energy: parseFloat(monthlyEnergy.toFixed(2)),
            euros: parseFloat(monthlyEuros.toFixed(2)),
          });
        }
      }
    }

    if (monthlyResults.length === 0) {
      return {
        error: `No valid monthly data found`,
        status: 404,
      };
    }

    return {
      surfaceArea,
      panelEfficiency,
      monthlyResults,
    };
  }
  catch (error) {
    console.error(`Error retrieving solar data:`, error);
    return {
      error: `Unable to retrieve solar data`,
      status: 500,
    };
  }
});
