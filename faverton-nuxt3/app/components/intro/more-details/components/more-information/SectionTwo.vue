<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const titleSection2 = ref<HTMLElement | null>(null);
const subTitleSection2 = ref<HTMLElement | null>(null);

onMounted(() => {
  if (titleSection2.value) {
    gsap.fromTo(
      titleSection2.value,
      {
        autoAlpha: 0,
        x: -100,
      },
      {
        autoAlpha: 1,
        x: 0,
        duration: 1,
        scrollTrigger: {
          trigger: titleSection2.value,
          start: `top 75%`,
          once: true,
        },
      },
    );
  }
});

onMounted(() => {
  if (subTitleSection2.value) {
    gsap.fromTo(
      subTitleSection2.value,
      {
        autoAlpha: 0,
        x: -100,
      },
      {
        autoAlpha: 1,
        x: 0,
        duration: 1,
        scrollTrigger: {
          trigger: subTitleSection2.value,
          start: `top 60%`,
          once: true,
        },
      },
    );
  }
});
</script>

<template>
  <div class="border-r-2 border-black">
    <div class="min-w-xl p-10 flex flex-col justify-center h-full">
      <div
        ref="titleSection2"
        class="relative left-10 mb-5"
      >
        <FavertonChapterTitle title="Vos données vous porterons vers de nouveaux sommets" />
      </div>
      <div
        ref="subTitleSection2"
        class="relative left-10"
      >
        <FavertonParagraphe pargraphe="Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro voluptatum deleniti omnis, excepturi" />
      </div>
    </div>
  </div>
  <div
    class="w-[70%]"
  >
    <div class="w-full h-full grid justify-center">
      <div class="grid gap-5 grid-cols-2">
        <div class="grid h-full mt-[-90px]">
          <div>
            <IntroMoreDetailsComponentsPointsDetails />
          </div>
          <div>
            <IntroMoreDetailsComponentsPointsDetails />
          </div>
        </div>

        <div class="grid items-center h-full mt-[-80px]">
          <div>
            <IntroMoreDetailsComponentsPointsDetails />
          </div>
          <div>
            <IntroMoreDetailsComponentsPointsDetails />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
