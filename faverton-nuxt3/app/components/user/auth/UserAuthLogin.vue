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

const gotToRegister = () => {
  navigateTo(`/user/register`);
};
</script>

<template>
  <div class="flex flex-col justify-center h-screen items-center gap-3">
    <h1>
      Se connecter
    </h1>

    <form
      class="gap-4 flex flex-col"
      @submit.prevent="login"
    >
      <UInput
        v-model="email"
        color="primary"
        variant="outline"
        type="email"
        placeholder="Email"
      />
      <UInput
        v-model="password"
        color="primary"
        variant="outline"
        type="password"
        placeholder="Password"
      />
      <UButton
        label="Continuer"
        type="submit"
      />
    </form>
    <p
      class="text-xs"
      :class="error?'text-red-500' : 'text-green-500'"
    >
      {{ message }}
    </p>
    <UButton
      variant="link"
      label="Inscription"
      type="submit"
      @click="gotToRegister"
    />
  </div>
</template>
