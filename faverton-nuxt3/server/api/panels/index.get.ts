import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler (async (event) => {
  const client = await serverSupabaseClient(event);

  //   TODO: passe user id comme query
  const { data, error: PostgrestError } = await client
    .from(`panel`)
    .select(`*`);

  if (PostgrestError) {
    throw createError({
      statusCode: 500,
      message: PostgrestError.message,
    });
  }

  return data;
});
