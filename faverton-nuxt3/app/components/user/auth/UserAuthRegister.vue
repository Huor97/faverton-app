<script setup lang="ts">
const supabase = useSupabaseClient();

const email = ref('');
const password = ref('');
const message = ref('');
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
      message.value = `Email de confirmation envoyé à ${email.value}. 
Veuillez vérifier votre boîte de réception et dossier courriers indésirables, puis cliquer sur le lien pour activer votre compte.`;

      isSuccess.value = true;
    }
  }
  catch (err) {
    message.value = 'Une erreur inattendue s\'est produite';
    isSuccess.value = false;
    console.error('Erreur lors de l\'inscription:', err);
  }
  finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col h-screen items-center gap-3">
    <div class="z-index-[999] fixed left-2 md:left-32 top-4">
      <UBreadcrumb
        :links="[{ label: 'Accueil', to: '/introduction' }, { label: 'Créer un compte' }]"
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
      Créer un compte
    </h1>

    <form
      class="gap-4 flex flex-col w-full px-8 sm:px-0 sm:w-1/4"
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
        placeholder="Mot de passe"
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
      class="text-s flex w-1/2 md:w-1/4"
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
    <UDivider label="OU" />
    <FavertonAuthFoot />
  </div>
</template>
