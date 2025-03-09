import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler (async (event) => {
  const query = getQuery(event);

  // Validation explicite
  if (!query.model) {
    return []; // Retourne un tableau vide si les paramètres sont manquants
  }
  const client = await serverSupabaseClient(event);

  const { data, error: PostgrestError } = await client
    .from(`panel`)
    .select(`*`)
    .eq(`model`, query.model as string);

  if (PostgrestError) {
    throw createError({
      statusCode: 500,
      message: PostgrestError.message,
    });
  }

  return data;
});
