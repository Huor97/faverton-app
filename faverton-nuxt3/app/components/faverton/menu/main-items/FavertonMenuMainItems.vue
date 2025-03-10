<script setup lang="ts">
defineProps<{
  items: { title: string, link: string }[]
}>();
</script>

<template>
  <div class="flex flex-col">
    <NuxtLink
      v-for="item in items"
      :key="item.link"
      :to="item.link"
      class="text-l font-bold text-white p-2 w-64"
    >
      {{ item.title }}
    </NuxtLink>
  </div>
</template>
