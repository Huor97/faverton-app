<script setup lang="ts">
const supabase = useSupabaseClient();
const email = ref('');
const password = ref('');
const message = ref('');
const error = ref('');

const login = async () => {
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });
  error.value = authError ? 'Erreur d\'authentification' : '';

  if (authError) {
    message.value = 'L\'authentification n\'a pas pu s\'effectuer. Une erreur s\'est produite. Vous pouvez nous contacter au support via le lien ci-dessous.';
  }
  else {
    message.value = 'Connexion réussie';
    navigateTo('/simulator');
  }
};
</script>

<template>
  <div class="flex flex-col h-screen items-center gap-3">
    <div class="z-index-[999] fixed left-2 md:left-32 top-4">
      <UBreadcrumb
        :links="[{ label: 'Accueil', to: '/introduction' }, { label: 'Se connecter' }]"
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

    <FavertonBanner />

    <h1>
      Se connecter
    </h1>

    <form
      class="gap-4 flex flex-col w-full px-8 sm:px-0 sm:w-1/4"
      @submit.prevent="login"
    >
      <UInput
        v-model="email"
        color="primary"
        variant="outline"
        type="email"
        placeholder="Email"
        size="xl"
        data-testid="login-email-input"
      />
      <UInput
        v-model="password"
        color="primary"
        variant="outline"
        type="password"
        placeholder="Mot de passe"
        size="xl"
        data-testid="login-password-input"
      />
      <div>
        <UButton
          label="Continuer"
          type="submit"
          data-testid="login-submit-button"
        />
      </div>
    </form>
    <p
      class="text-xs text-balance w-1/2 md:w-1/3 text-center"
      :class="error?'text-red-500' : 'text-green-500'"
    >
      {{ message }}
    </p>
    <NuxtLink
      v-if="error"
      to="/contact"
      class="text-xs text-blue-500 underline decoration-1"
    >
      Contacter le support
    </NuxtLink>
    <NuxtLink
      to="/user/register"
    >
      Pas encore de compte ?
      <span class="text-blue-500">
        Inscrivez-vous
      </span>
    </NuxtLink>
    <UDivider label="OU" />
    <FavertonAuthFoot />
  </div>
</template>
