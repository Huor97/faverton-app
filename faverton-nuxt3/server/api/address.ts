export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const address = query.q;
  const url = `https://api-adresse.data.gouv.fr/search`;

  if (!address) {
    throw createError({
      statusCode: 400,
      statusMessage: `Address query parameter is required`,
    });
  }
  const response = await $fetch(url, {
    query: { q: encodeURIComponent(address as string), limit: 5 },
  });
  return response;
});
