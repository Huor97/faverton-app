<script setup lang="ts">
const UserLogin = defineAsyncComponent(() => import('~/components/user/auth/UserAuthLogin.vue'));
const UserRegister = defineAsyncComponent(() => import('~/components/user/auth/UserAuthRegister.vue'));

const route = useRoute();

const activeComponent = computed(() => {
  switch (route.params.slug) {
    case 'login':
      return UserLogin;
    case 'register':
      return UserRegister;
    default:
      return undefined;
  }
});

if (!activeComponent.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true });
}
</script>

<template>
  <div>
    <component :is="activeComponent" />
  </div>
</template>
