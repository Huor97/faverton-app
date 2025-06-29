<script setup lang="ts">
const model = defineModel<number>('modelValue');

const MIN_SURFACE = 5;

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = Number(target.value);

  if (value < MIN_SURFACE && value !== 0) {
    model.value = MIN_SURFACE;
    target.value = MIN_SURFACE.toString();
  }
  else if (value >= MIN_SURFACE) {
    model.value = value;
  }
};

const handleBlur = () => {
  if (model.value && model.value < MIN_SURFACE) {
    model.value = MIN_SURFACE;
  }
};
</script>

<template>
  <div class="flex items-center w-full">
    <UInput
      v-model="model"
      type="number"
      :min="5"
      :max="10000"
      step="1"
      placeholder="Entrez la surface (min. 5m²)"
      size="xl"
      class="w-full"
      @input="handleInput"
      @blur="handleBlur"
    >
      <template #trailing>
        <span class="ml-2 text-gray-500">m²</span>
      </template>
    </UInput>
  </div>
</template>
