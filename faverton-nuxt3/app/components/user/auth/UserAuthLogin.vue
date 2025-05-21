<script setup lang="ts">
const supabase = useSupabaseClient();
const email = ref(``);
const password = ref(``);
const message = ref(``);
const error = ref(``);

const login = async () => {
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });
  error.value = authError ? `Erreur d'authentification` : ``;

  if (authError) {
    message.value = `Login ne peut pas être effectué, une erreur s'est produite`;
  }
  else {
    message.value = `Connexion réussie`;
    navigateTo(`/simulator`);
  }
};
</script>

<template>
  <div class="flex flex-col justify-center bg-yellow-100 h-screen items-center gap-3">
    <div class="z-index-[999] fixed left-32 top-4">
      <UBreadcrumb
        :links="[{ label: 'Introduction', to: '/introduction' }, { label: 'Se connecter' }]"
      >
        <template #default="{ link, isActive }">
          <UBadge
            :color="isActive ? 'primary' : 'gray'"
            class="rounded-full truncate"
          >
            {{ link.label }}
          </UBadge>
        </template>
      </UBreadcrumb>
    </div>

    <h1>
      Se connecter
    </h1>

    <form
      class="gap-4 flex flex-col w-1/4"
      @submit.prevent="login"
    >
      <UInput
        v-model="email"
        color="primary"
        variant="outline"
        type="email"
        placeholder="Email"
        size="xl"
      />
      <UInput
        v-model="password"
        color="primary"
        variant="outline"
        type="password"
        placeholder="Password"
        size="xl"
      />
      <div>
        <UButton
          label="Continuer"
          type="submit"
        />
      </div>
    </form>
    <p
      class="text-xs"
      :class="error?'text-red-500' : 'text-green-500'"
    >
      {{ message }}
    </p>
    <NuxtLink
      to="/user/register"
    >
      Pas encore de compte ?
      <span class="text-blue-500">
        Inscrivez-vous
      </span>
    </NuxtLink>
  </div>
</template>
