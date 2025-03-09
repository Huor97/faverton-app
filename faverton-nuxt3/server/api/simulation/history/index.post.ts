// server/api/simulation/update-history.post.ts
import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!body.simulationId) {
      return createError({
        statusCode: 400,
        message: `L'ID de simulation est requis`,
      });
    }

    const supabase = await serverSupabaseClient(event);

    const { data, error } = await supabase
      .from(`simulation`)
      .update({ history: body.history })
      .eq(`simulation_id`, body.simulationId)
      .select();

    if (error) {
      console.error(`Erreur Supabase:`, error);
      return createError({
        statusCode: 500,
        message: `Erreur lors de la mise à jour de la simulation`,
        data: error,
      });
    }

    return {
      success: true,
      data,
    };
  }
  catch (error) {
    console.error(`Erreur du serveur:`, error);
    return createError({
      statusCode: 500,
      message: `Erreur du serveur`,
      data: error,
    });
  }
});
