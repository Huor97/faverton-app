<script setup lang="ts">
const supabase = useSupabaseClient();

const email = ref(``);
const password = ref(``);
const message = ref(``);

const register = async () => {
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  });
  if (error) {
    message.value = `Les connexions anonymes sont désactivées`;
  }
  else {
    message.value = `Un email de confirmation a été envoyé à ${email.value}.`;
  }
};

const gotoLogin = () => {
  navigateTo(`/login`);
};
</script>

<template>
  <UContainer class="h-screen flex flex-col justify-center items-center">
    <div>
      <h1 class=" h-10">
        Crée un compte
      </h1>

      <form
        class="gap-4 flex"
        @submit.prevent="register"
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
        class="text-red-500 text-xs"
      >
        {{ message }}
      </p>

      <UButton
        variant="link"
        label="se connecter"
        type="submit"
        @click="gotoLogin"
      />
    </div>
  </UContainer>
</template>
