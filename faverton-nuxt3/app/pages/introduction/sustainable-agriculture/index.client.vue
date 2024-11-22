<script lang="ts" setup>
const data = {
  title: `Sustainable Agriculture`,
  subTitle: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
  button: `Learn more`,
};
</script>

<template>
  <div>
    <IntroSourceEnergies
      :title="data.title"
      :sub-title="data.subTitle"
      :button="data.button"
    />
  </div>
</template>
