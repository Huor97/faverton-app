export default defineNuxtRouteMiddleware(() => {
  const user = useSupabaseClient();
  if (!user) {
    return navigateTo(`/`);
  }
});
