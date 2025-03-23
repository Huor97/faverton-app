<script setup lang="ts">
import { gsap } from 'gsap';
import logo from '~/assets/favertonLogo.png';

const box = ref(null);
const hasScrolled = ref(false);
const animationTriggered = ref(false);

function triggerAnimation() {
  if (!animationTriggered.value && box.value) {
    animationTriggered.value = true;

    gsap.to(box.value, {
      left: `0`,
      xPercent: -31,
      y: `-11vh`,
      scale: 0.2,
      duration: 1.5,
      ease: `power2.inOut`,
      delay: 0.2,
    });
  }
}

function handleScroll() {
  if (!hasScrolled.value && window.scrollY > 10) {
    hasScrolled.value = true;
    triggerAnimation();

    window.removeEventListener(`scroll`, handleScroll);
  }
}

onMounted(() => {
  window.addEventListener(`scroll`, handleScroll);
});

onUnmounted(() => {
  window.removeEventListener(`scroll`, handleScroll);
});
</script>

<template>
  <div>
    <div class="w-full h-[25vh]">
      <div
        ref="box"
        class="box"
      >
        <img
          :src="logo"
          alt="faverton"
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.box {
    width: 200px;
    height: 200px;
    position: fixed;
    top: 15%;
    left: 52%;
    transform: translate(-50%, -50%);
  }
</style>
