<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types';

const displayedForm = defineModel<`connection` | `forgetPass` | `register`>({ required: true });

const forgetPassRef = ref(false);
const state = reactive({
  email: undefined,
  password: undefined,
});

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.email) errors.push({ path: `email`, message: `Required` });
  if (!state.password) errors.push({ path: `password`, message: `Required` });
  return errors;
};

async function onSubmit(event: FormSubmitEvent<any>) {
  // Do something with data
  console.log(event.data);
}
</script>

<template>
  <UForm
    v-model="forgetPassRef"
    :validate="validate"
    :state="state"
    class="space-y-4 flex flex-col items-center"
    @submit="onSubmit"
  >
    <p class="text-center max-w-xs">
      Saisissez votre adresse e-mail pour réinitialiser votre mot de passe
    </p>
    <UFormGroup
      label="Email"
      name="email"
      class="w-full"
    >
      <UInput v-model="state.email" />
    </UFormGroup>

    <UButton type="submit">
      Réinitialiser le mot de passe
    </UButton>
    <UButton
      variant="link"
      @click="displayedForm = 'connection'"
    >
      <span class="text-blue-500 text-xs">
        Annuler
      </span>
    </UButton>
  </UForm>
</template>
