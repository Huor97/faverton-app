export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const address = query.q as string;
  const url = `https://data.geopf.fr/geocodage/search`;
  // NOTE: api version
  // https://data.geopf.fr/geocodage/search (la nouvelle)
  // https://api-adresse.data.gouv.fr/search (l'ancien)

  if (!address) {
    return [];
  }

  if (address.length < 4) {
    return [];
  }

  const response = await $fetch(url, {
    query: { q: address, limit: 7, autocomplete: 1 },
  });
  return response;
});
