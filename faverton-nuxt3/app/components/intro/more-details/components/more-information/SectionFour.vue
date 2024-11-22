<script setup lang="ts">
import { gsap } from 'gsap';

const titleSectionFour = ref<HTMLElement | null>(null);

onMounted(() => {
  if (titleSectionFour.value) {
    gsap.fromTo(
      titleSectionFour.value,
      {
        autoAlpha: 0,
        y: 60,
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: titleSectionFour.value,
          start: `top 80%`,
          once: true,
        },
      },
    );
  }
});
</script>

<template>
  <div class="flex flex-col justify-center items-center">
    <div
      ref="titleSectionFour"
      class="mb-16"
    >
      <h2 class="text-3xl">
        Nous sommes fiers de nos chiffres
      </h2>
    </div>
    <div class="grid grid-cols-5 gap-16">
      <div>
        <IntroductionMoreDetailsComponentsOurFigures />
      </div>
      <div>
        <IntroductionMoreDetailsComponentsOurFigures />
      </div>
      <div>
        <IntroductionMoreDetailsComponentsOurFigures />
      </div>
      <div>
        <IntroductionMoreDetailsComponentsOurFigures />
      </div>
      <div>
        <IntroductionMoreDetailsComponentsOurFigures />
      </div>
    </div>
  </div>
</template>
