<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { gsap } from 'gsap';

const section1 = ref<HTMLElement | null>(null);

onMounted(() => {
  if (section1.value) {
    gsap.from(section1.value.children, {
      opacity: 0,
      y: 20,
      stagger: 0.3,
      scrollTrigger: {
        trigger: section1.value,
        start: `top 60%`,
        end: `bottom 45%`,
        scrub: true,
        onLeave: () => {
          if (section1.value) {
            gsap.to(section1.value.children, { opacity: 0 });
          }
        },
        // markers: true, // Utile pour le débogage, à retirer en production
      },
    });
  }
});
</script>

<template>
  <div class="relative text-white w-1/4 h-screen">
    <div
      ref="section1"
      class=" flex flex-col w-screen items-center justify-center"
    >
      <p class="w-1/4 p-5 shadow-lg shadow-green-500/60 backdrop-blur-sm">
        <b>Wind Turbine.</b>
        <span class="text-slate-400">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam fugit, doloremque accusamus
          recusandae suscipit blanditiis, architecto eum ab accusantium dignissimos animi consequatur, pariatur
          qui delectus odio consectetur atque aut eius!
          Qui, error. Perspiciatis, voluptatem. Laudantium veniam deleniti temporibus
        </span>
        <br>
        <NuxtLink
          class="underline underline-offset-8 hover:decoration-sky-500"
          to="introduction/wind-turbine"
          text="mor information"
        />
      </p>
    </div>
  </div>
</template>
