<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types';

const model = defineModel();

const state = reactive({
  inputValue: 1,
});

const validate = (state: { inputValue: number | undefined }): FormError[] => {
  const errors = [];
  if (!state.inputValue) errors.push({ path: `number`, message: `La valeur doit être entre 1 et 100` });
  return errors;
};

async function onSubmit(event: FormSubmitEvent<{ inputValue: number }>) {
  model.value = event.data.inputValue;
}
</script>

<template>
  <UForm
    :validate="validate"
    :state="state"
    @submit="onSubmit"
  >
    <UFormGroup
      label="Entrez un nombre entre 1 et 100"
      name="number"
    >
      <UInput
        v-model="state.inputValue"
        type="number"
        :min="1"
        :max="100"
        step="1"
      />
    </UFormGroup>
    <UButton type="submit">
      Soumettre
    </UButton>
  </UForm>
</template>
