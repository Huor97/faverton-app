import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!body.simulationId) {
      return createError({
        statusCode: 400,
        message: `simulation id is required`,
      });
    }

    const supabase = await serverSupabaseClient(event);

    const { data, error } = await supabase
      .from(`simulation`)
      .update({ history: body.history, surface: body.surface, user_id: body.userId })
      .eq(`simulation_id`, body.simulationId)
      .select();

    if (error) {
      console.error(`Error Supabase:`, error);
      return createError({
        statusCode: 500,
        message: `Error updating simulation`,
        data: error,
      });
    }

    return {
      success: true,
      data,
    };
  }
  catch (error) {
    console.error(`Server error:`, error);
    return createError({
      statusCode: 500,
      message: `Server error`,
      data: error,
    });
  }
});
