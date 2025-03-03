<script setup lang="ts">
import type { State } from '~/types/state.ts';
import type { FormError, FormSubmitEvent } from '#ui/types';

const displayedForm = defineModel<`connection` | `forgetPass` | `register`>({ required: true });
const client = useSupabaseClient();
const router = useRouter();

const errorMsg = ref(``);
const isLoading = ref(false);

const state = reactive<State>({
  email: ``,
  password: ``,
});

const validate = (state: State): FormError[] => {
  const errors: FormError[] = [];
  if (!state.email) errors.push({ path: `email`, message: `Email requis` });
  else if (!/^\S+@\S+\.\S+$/.test(state.email)) errors.push({ path: `email`, message: `Email invalide` });
  if (!state.password) errors.push({ path: `password`, message: `Mot de passe requis` });
  else if (state.password.length < 6) errors.push({ path: `password`, message: `Le mot de passe doit contenir au moins 6 caractères` });
  return errors;
};

async function signIn() {
  try {
    isLoading.value = true;
    errorMsg.value = ``;
    const { error } = await client.auth.signInWithPassword({
      email: state.email,
      password: state.password,
    });
    if (error) throw error;
    router.push(`/profile`);
  }
  catch (error) {
    if (error instanceof Error) errorMsg.value = error.message;
  }
  finally {
    isLoading.value = false;
  }
}

async function onSubmit(event: FormSubmitEvent<typeof state>) {
  if (event.data) {
    await signIn();
  }
}
</script>

<template>
  <UForm
    :validate="validate"
    :state="state"
    class="space-y-4 flex flex-col items-center"
    @submit.prevent="onSubmit"
  >
    <UFormGroup
      label="Email"
      name="email"
      class="w-full"
    >
      <UInput
        v-model="state.email"
        type="email"
      />
    </UFormGroup>

    <UFormGroup
      label="Password"
      name="password"
      class="w-full"
    >
      <UInput
        v-model="state.password"
        type="password"
      />
    </UFormGroup>

    <UButton type="submit">
      Se connecter
    </UButton>

    <UButton
      variant="link"
      color="blue"
      @click="displayedForm = 'forgetPass'"
    >
      <span class="text-blue-500 text-xs hover:underline">
        Réinitialiser le mot de passe
      </span>
    </UButton>
    <div>
      <span class="text-xs text-gray-500">
        Pas de compte?
      </span>
      <UButton
        variant="link"
        color="blue"
        @click="displayedForm = 'register'"
      >
        <span class="text-blue-500 text-xs">Créez-en un</span>
      </UButton>
    </div>
  </UForm>
</template>
