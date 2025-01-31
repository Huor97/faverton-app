export default defineEventHandler((event) => {
  const query = getQuery(event);

  const EDF_PRICE = 0.1269;
  const HIGH_PERFORMANCE_PANEL = 0.2;

  const annualKwh = Number(query.annualKwh);
  const surfaceArea = Number(query.surface);

  if (isNaN(annualKwh) || isNaN(surfaceArea)) {
    return {
      error: `Paramètres invalides`,
      status: 400,
    };
  }

  const amountEurosPerYear = annualKwh * surfaceArea * EDF_PRICE * HIGH_PERFORMANCE_PANEL;

  return {
    annualKwh,
    surfaceArea,
    amountEurosPerYear,
  };
});
