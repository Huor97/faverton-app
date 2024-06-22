<script setup lang="ts">
import gsap from "gsap"
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import { onMounted, onUnmounted, ref } from "vue";
// console.log("gsap", gsap)
// console.log("gsap", ScrollTrigger)

gsap.registerPlugin(ScrollTrigger)


const container = ref(null)
const image = ref(null)
// @ts-ignore
let scrollTrigger


onMounted(() => {
  const img = image.value;
  
  scrollTrigger = ScrollTrigger.create({
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress * 4;
      const stage = Math.floor(progress);
      const stageProgress = progress - stage;

      let x, y;
      const zoom = 1.5 + progress * 0.5;

      switch(stage) {
        case 0: // Haut gauche à haut droit
          console.log("0");
          x = gsap.utils.interpolate(0, -25, stageProgress);
          y = 0;
          break;
        case 1: // Haut droit à bas droit
          console.log("1");
          x = -80;
          y = gsap.utils.interpolate(-90, -30, stageProgress);
          break;
        case 2: // Haut droit à bas droit
          console.log("2");
          x = -30;
          y = gsap.utils.interpolate(-150, 0, stageProgress);
          break;
        default:
          console.log("finit");
          x = 0;
          y = -130;
      }

      gsap.to(img, {
        xPercent: x,
        yPercent: y,
        scale: zoom,
        duration: 1,
        ease: "power2.out"
      });
    }
  });
})


onUnmounted(() => {
        // @ts-ignore
    if (scrollTrigger) scrollTrigger.kill()
})

</script>

<template>
    <div class="image-container" ref="container">
        <img src="../assets/faverton_background.jpg" alt="background" ref="image">
    </div>
</template>

<style scoped>
.image-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.image-container > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform-origin: top left;
}
</style>
