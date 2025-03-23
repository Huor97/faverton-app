<script setup lang="ts">
definePageMeta({
  middleware: [`auth`],
});
</script>

<template>
  <UserAuthLogin />
</template>
