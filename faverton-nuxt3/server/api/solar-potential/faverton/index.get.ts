import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  // Validation explicite
  if (!query.postalCode || !query.city) {
    return []; // Retourne un tableau vide si les paramètres sont manquants
  }

  const client = await serverSupabaseClient(event);

  // TODO: ajoute le type
  const { data, error: PostgrestError } = await client
    .from(`solar_energy`)
    .select(`*`)
    .eq(`postal_code`, query.postalCode as string)
    .eq(`city`, query.city as string);

  if (PostgrestError) {
    throw createError({
      statusCode: 500,
      message: PostgrestError.message,
    });
  }

  return data;
});
