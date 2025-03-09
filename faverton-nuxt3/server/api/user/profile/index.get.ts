import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler (async (event) => {
  const query = getQuery(event);

  if (!query.userId) {
    throw createError({
      statusCode: 400,
      message: `Zip user`,
    });
  }

  const client = await serverSupabaseClient(event);

  const { data: profileData, error: profileError } = await client
    .from(`profiles`)
    .select(`*`)
    .eq(`id`, query.userId as string)
    .single();

  if (profileError) {
    throw createError({
      statusCode: 500,
      statusMessage: `Erreur lors de la récupération de la simulation`,
    });
  }

  if (!profileData) {
    throw createError({
      statusCode: 404,
      statusMessage: `Simulation non trouvée`,
    });
  }

  return {
    profile: profileData,
  };
});
