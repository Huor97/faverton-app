import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;
    if (!id) {
      return createError({
        statusCode: 400,
        message: `Missing simulation ID`,
      });
    }

    const supabase = await serverSupabaseClient(event);

    const { data, error } = await supabase
      .from(`simulation`)
      .update({
        history: false,
        surface: null,
      })
      .eq(`simulation_id`, id)
      .select();

    if (error) {
      console.error(`Error Supabase`, error);
      return createError({
        statusCode: 500,
        message: `Error deleting simulation`,
        data: error,
      });
    }

    return {
      success: true,
      data,
    };
  }
  catch (error) {
    console.error(`Server error`, error);
    return createError({
      statusCode: 500,
      message: `Error server`,
      data: error,
    });
  }
});
