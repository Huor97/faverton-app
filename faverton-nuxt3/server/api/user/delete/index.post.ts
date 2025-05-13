import { createClient } from '@supabase/supabase-js';
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {
    const { shouldSoftDelete = true } = await readBody(event);

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error(`Supabase environment variables are not defined`);
    }

    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceKey,
    );

    // Obtenir l'ID de l'utilisateur à partir de la session actuelle
    const client = await serverSupabaseClient(event);
    const { data: { user }, error: authError } = await client.auth.getUser();

    if (authError || !user) {
      return { success: false, error: `User not authenticated` };
    }

    // Supprimer l'utilisateur avec l'option shouldSoftDelete
    const { error } = await supabaseAdmin.auth.admin.deleteUser(
      user.id,
      shouldSoftDelete,
    );

    if (error) throw error;

    // Supprimer également les données associées dans les autres tables
    // await supabaseAdmin.from(`profiles`).delete().eq(`user_id`, user.id);

    return { success: true };
  }
  catch (error: Error | unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error while deleting account:`, errorMessage);
    return { success: false, error: errorMessage };
  }
});
