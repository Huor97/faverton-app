<script setup lang="ts">
const { data: profiles, error } = await useAsyncData(
  `supabase-profiles`, // Clé unique pour la mise en cache
  useSupabaseProfiles,
);
</script>

<template>
  <div>
    <pre>{{ profiles }}</pre>
    <pre>{{ error }}</pre>
    <h1>hello</h1>
  </div>
</template>
