<script setup lang="ts">
import BirdModel from './BirdModel.vue';

const { isMobile } = useDevice();
const isSmallScreen = computed(() => isMobile);
</script>

<template>
  <TresCanvas
    window-size
    alpha
  >
    <TresPerspectiveCamera :position="!isSmallScreen ? [0, 0, 5] : [0, 0, 8]" />
    <Suspense>
      <BirdModel />
      <template #fallback>
        <!-- Optional: 3D placeholder or just null -->
        <TresGroup />
      </template>
    </Suspense>
    <TresAmbientLight :intensity="2" />
    <TresDirectionalLight
      :intensity="3"
      :position="[5, 5, 5]"
    />
  </TresCanvas>
</template>
