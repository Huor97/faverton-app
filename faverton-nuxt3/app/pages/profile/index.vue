<script lang="ts" setup>
definePageMeta({
  middleware: [`auth`],
});
</script>

<template>
  <div>
    <UserAuthProfileAccount />
  </div>
</template>
