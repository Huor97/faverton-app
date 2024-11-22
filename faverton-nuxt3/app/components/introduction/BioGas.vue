<script setup lang="ts">
import { onMounted, ref } from "vue";
import { gsap } from 'gsap';

const bioGazRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (bioGazRef.value) {
    gsap.fromTo(
      bioGazRef.value,
      {
        autoAlpha: 0,
        x: -50,
      },
      {
        autoAlpha: 1,
        x: 0,
        scrollTrigger: {
          trigger: bioGazRef.value,
          start: `top 55%`,
          end: `bottom 60%`,
          toggleActions: `play reverse play reverse`,
          // markers: true,
        },
      },
    );
  }
});
</script>

<template>
  <div class="h-screen w-1/4 text-white relative container-section ">
    <div
      ref="bioGazRef"
      class="bottom-80 relative left-[30vw] p-5 shadow-lg shadow-green-500/60 backdrop-blur-sm"
    >
      <p>
        <b>Bio gas.</b>
        <span class="text-slate-400">
          Lorem ipsum dolor sit amet. Magnam fugit, doloremque accusamus
          recusandae suscipit blanditiis, architecto eum ab accusantium dignissimos animi consequatur, pariatur
          qui delectus odio consectetur atque aut eius!
          Qui, error. Perspiciatis, voluptatem. Laudantium veniam deleniti temporibus.
        </span>
        <br>
        <NuxtLink
          class="underline underline-offset-8 hover:decoration-sky-500"
          to="introduction/bio-gaz"
          text="mor information"
        />
      </p>
    </div>
  </div>
</template>
