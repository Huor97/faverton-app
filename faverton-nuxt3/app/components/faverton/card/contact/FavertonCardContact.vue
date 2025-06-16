<template>
  <UCard class="h-full">
    <template #header>
      <div class="flex items-center gap-3">
        <UIcon
          :name="icon"
          class="text-2xl text-primary"
        />
        <h3 class="text-xl font-semibold">
          {{ title }}
        </h3>
      </div>
    </template>

    <div class="space-y-4">
      <slot />
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  title: string
  icon: string
}

defineProps<Props>();
</script>
