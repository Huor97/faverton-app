<script setup lang="ts">
const supabase = useSupabaseClient();

const email = ref(``);
const password = ref(``);
const message = ref(``);
const isSuccess = ref(false);
const isSubmitting = ref(false);

const register = async () => {
  try {
    isSubmitting.value = true;
    const { error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    });

    if (error) {
      message.value = `Une erreur s'est produite lors de l'inscription : ${error.message}`;
      isSuccess.value = false;
    }
    else {
      message.value = `Un email de confirmation a été envoyé à ${email.value}. Veuillez vérifier votre boîte de réception pour activer votre compte.`;
      isSuccess.value = true;
    }
  }
  catch (err) {
    message.value = `Une erreur inattendue s'est produite`;
    isSuccess.value = false;
    console.error(`Erreur lors de l'inscription:`, err);
  }
  finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col justify-center bg-yellow-100 h-screen items-center gap-3">
    <h1>
      Crée un compte
    </h1>

    <form
      class="gap-4 flex flex-col w-1/4"
      @submit.prevent="register"
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
          :loading="isSubmitting"
          :disabled="isSubmitting"
        />
      </div>
    </form>
    <p
      class="text-s flex w-1/4"
      :class="isSuccess === false? 'text-red-500' : 'text-green-500'"
    >
      {{ message }}
    </p>

    <NuxtLink
      to="/user/login"
    >
      Vous possédez un compte
      <span class="text-blue-500">
        Accédez à votre espace
      </span>
    </NuxtLink>
  </div>
</template>
