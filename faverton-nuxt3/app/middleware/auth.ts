export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser();

  if (to.path.startsWith(`/profile`) && !user.value) {
    return navigateTo(`/login`);
  }

  if (to.path === `/login` && user.value) {
    return navigateTo(`/profile`);
  }
});
