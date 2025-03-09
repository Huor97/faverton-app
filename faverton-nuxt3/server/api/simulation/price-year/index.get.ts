export default defineEventHandler((event) => {
  const query = getQuery(event);

  const EDF_PRICE = 0.1269;

  const annualKwh = Number(query.annualKwh);
  const surfaceArea = Number(query.surface);
  const panelEfficiency = query.panelEfficiency ? Number(query.panelEfficiency) : null;

  if (isNaN(annualKwh) || isNaN(surfaceArea) || surfaceArea == 0 || panelEfficiency === null || isNaN(panelEfficiency)) {
    return {
      error: `Paramètres invalides`,
      status: 400,
    };
  }

  const HIGH_PERFORMANCE_PANEL = Number((panelEfficiency / 100).toFixed(2));
  const amountEurosPerYear = annualKwh * surfaceArea * EDF_PRICE * HIGH_PERFORMANCE_PANEL;

  return {
    annualKwh,
    surfaceArea,
    amountEurosPerYear,
  };
});
