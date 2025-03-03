export const useSupabaseProfiles = async () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const { data: profiles, error } = await supabase
    .from(`profiles`)
    .select(`*`).eq(`id`, user.value?.id || ``)
    .single();

  if (error) {
    throw error;
  }

  return profiles;
};
