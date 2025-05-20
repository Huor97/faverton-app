<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types';

const displayedForm = defineModel<`connection` | `forgetPass` | `register`>({ required: true });

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
    :validate="validate"
    :state="state"
    class="space-y-4 flex flex-col items-center"
    @submit="onSubmit"
  >
    <UFormGroup
      label="Email"
      name="email"
      class="w-full"
    >
      <UInput v-model="state.email" />
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
      Créer un compte
    </UButton>
    <UButton
      variant="link"
      color="blue"
      @click="displayedForm = 'connection'"
    >
      <span class="text-xs">
        Se connecter
      </span>
    </UButton>
  </UForm>
</template>
