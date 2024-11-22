<script lang="ts" setup>
const data = {
  title: `Bio Gaz Lorem ipsum dolor sit amet wind turbine`,
  subTitle: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
  button: `Learn more`,
};
</script>

<template>
  <div>
    <IntroductionSourceEnergies
      :title="data.title"
      :sub-title="data.subTitle"
      :button="data.button"
    />
  </div>
</template>
