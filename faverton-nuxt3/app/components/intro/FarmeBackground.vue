<script setup lang="ts">
import gsap from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const container = ref(null);
const image = ref(null);

let scrollTrigger: globalThis.ScrollTrigger;

onMounted(() => {
  const img = image.value;

  scrollTrigger = ScrollTrigger.create({
    trigger: `body`,
    start: `top top`,
    end: `bottom bottom`,
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress * 2.5;
      const stage = Math.floor(progress);
      const stageProgress = progress - stage;

      let x, y;
      const zoom = 1.5 + progress * 0.5;

      switch (stage) {
        case 0: // Haut gauche à haut droit
          x = gsap.utils.interpolate(0, -20, stageProgress);
          y = 0;
          break;
        case 1: // Haut droit à bas droit
          x = -80;
          y = gsap.utils.interpolate(-90, -30, stageProgress);
          break;
        case 2: // Haut droit à bas droit
          x = -5;
          y = gsap.utils.interpolate(-100, -200, stageProgress);
          break;
        default:
          x = 0;
          y = -150;
      }

      gsap.to(img, {
        xPercent: x,
        yPercent: y,
        scale: zoom,
        duration: 1,
        ease: `power2.out`,
      });
    },
  });
});

onUnmounted(() => {
  if (scrollTrigger) scrollTrigger.kill();
});
</script>

<template>
  <div
    ref="container"
    class=" fixed top-0 left-0 w-screen h-screen overflow-hidden"
  >
    <img
      ref="image"
      class="w-full h-full object-cover origin-top-left"
      src="~/assets/faverton_background.jpg"
      alt="farme"
    >
  </div>
</template>
