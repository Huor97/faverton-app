<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { gsap } from 'gsap';

const hedroElectricRef = ref<HTMLElement | null>(null);
const btn = ref<HTMLElement | null>(null);

onMounted(() => {
  if (hedroElectricRef.value) {
    gsap.fromTo(
      hedroElectricRef.value,
      {
        autoAlpha: 0,
        x: -50,
      },
      {
        autoAlpha: 1,
        x: 0,
        scrollTrigger: {
          trigger: hedroElectricRef.value,
          start: `top 55%`,
          end: `bottom 45%`,
          toggleActions: `play reverse play reverse`,
          // markers: true,
        },
      },
    );
  }
});

onMounted(() => {
  if (btn.value) {
    gsap.fromTo(
      btn.value,
      {
        autoAlpha: 0,
        x: -50,
      },
      {
        autoAlpha: 1,
        x: 0,
        scrollTrigger: {
          trigger: btn.value,
          start: `top 60%`,
          end: `bottom 40%`,
          toggleActions: `play reverse play reverse`,
          // markers: true,
        },
      },
    );
  }
});

const goToWindTurbine = () => {
  navigateTo(`/introduction/hydro-electric`);
};
</script>

<template>
  <div class="relative flex flex-col justify-end text-white overflow-hidden">
    <div
      ref="hedroElectricRef"
      class="flex flex-col items-center backdrop-blur-sm"
    >
      <p class="md:w-2/4 p-5">
        <b class="md:text-[32px]">Apprendre et Inspirer.</b>
        <span class="text-slate-100 md:text-[32px]">
          Participez à nos ateliers et programmes de formation pour découvrir comment adopter des pratiques agricoles durables et renouvelables dans votre propre communauté.
        </span>
      </p>
      <span
        ref="btn"
        class="w-2/4 p-5"
      >
        <FavertonBtn
          button="mor information"
          @click="goToWindTurbine"
        />
      </span>
    </div>
  </div>
</template>
