export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser();

  const guestRoutes = ['/user/login', '/user/register'];

  if (user.value && guestRoutes.includes(to.path)) {
    return navigateTo('/user/profile');
  }

  if (!user.value && !guestRoutes.includes(to.path)) {
    return navigateTo('/user/login');
  }
});
