export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const address = query.q as string;
  const url = `https://api-adresse.data.gouv.fr/search`;

  if (!address) {
    return [];
  }

  if (address.length <= 2) {
    return [];
  }

  const response = await $fetch(url, {
    query: { q: encodeURIComponent(address as string), limit: 5 },
  });
  return response;
});
