<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const numbersSectionFourRef = ref<HTMLElement | null>(null);
const paragraphSectionFourRef = ref<HTMLElement | null>(null);
const lignSectionFourRef = ref<HTMLElement | null>(null);

onMounted (() => {
  if (numbersSectionFourRef.value) {
    gsap.fromTo(
      numbersSectionFourRef.value,
      {
        autoAlpha: 0,
        x: -60,
      },
      {
        autoAlpha: 1,
        x: 0,
        duration: 1,
        scrollTrigger: {
          trigger: numbersSectionFourRef.value,
          start: `top 80%`,
          once: true,
        },
      },
    );
  }
});
onMounted (() => {
  if (paragraphSectionFourRef.value) {
    gsap.fromTo(
      paragraphSectionFourRef.value,
      {
        autoAlpha: 0,
        x: -60,
      },
      {
        autoAlpha: 1,
        x: 0,
        duration: 1,
        scrollTrigger: {
          trigger: paragraphSectionFourRef.value,
          start: `top 80%`,
          once: true,
        },
      },
    );
  }
});
onMounted (() => {
  if (lignSectionFourRef.value) {
    gsap.fromTo(
      lignSectionFourRef.value,
      {
        autoAlpha: 0,
        x: -60,
      },
      {
        autoAlpha: 1,
        x: 0,
        duration: 1,
        scrollTrigger: {
          trigger: lignSectionFourRef.value,
          start: `top 80%`,
          once: true,
        },
      },
    );
  }
});
</script>

<template>
  <div class="max-w-[250px] grid justify-center gap-5">
    <div
      ref="numbersSectionFourRef"
      class="text-6xl text-center"
    >
      <p>
        15
      </p>
    </div>
    <div
      ref="paragraphSectionFourRef"
      class="text-center"
    >
      <p>
        Années d'expérience
      </p>
    </div>
    <div class="w-[183px] h-5">
      <div
        ref="lignSectionFourRef"
        class="bg-[#00b4d8] rounded-[7px] shadow-lg h-[6px] min-h-[2px]"
      />
    </div>
  </div>
</template>
