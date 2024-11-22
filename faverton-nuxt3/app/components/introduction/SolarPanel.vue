<script setup lang="ts">
import { onMounted, ref } from "vue";
import { gsap } from 'gsap';

const SolarPanelRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (SolarPanelRef.value) {
    gsap.fromTo(
      SolarPanelRef.value,
      {
        autoAlpha: 0,
        x: -50,
      },
      {
        autoAlpha: 1,
        x: 0,
        scrollTrigger: {
          trigger: SolarPanelRef.value,
          start: `top 60%`,
          end: `bottom 50%`,
          toggleActions: `play reverse play reverse`,
        //   markers: true,
        },
      },
    );
  }
});
</script>

<template>
  <div class="h-screen w-1/4 text-white relative container-section container-s2">
    <div
      ref="SolarPanelRef"
      class="bottom-[80vh] relative left-[65vw] bottom-[10vw]  p-5 shadow-lg shadow-green-500/60 backdrop-blur-sm"
    >
      <p>
        <b>Solar panel.</b>
        <span class="text-slate-400">Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam fugit, doloremque accusamus recusandae
          suscipit blanditiis, architecto eum ab consectetur adipisicing elit, pariatur qui delectus
          odio consectetur atque aut eius!
          Qui, error. Perspiciatis, voluptatem. Laudantium veniam deleniti temporibus.
        </span>
        <NuxtLink
          class="underline underline-offset-8 hover:decoration-sky-500"
          to="introduction/solar-panel"
          text="mor information"
        />
      </p>
    </div>
  </div>
</template>
