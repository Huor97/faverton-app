export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser();

  if (to.path.startsWith(`/user/profile`) && !user.value) {
    return navigateTo(`/user/login`);
  }

  if (to.path === `/user/login` && user.value) {
    return navigateTo(`/user/profile`);
  }
});
