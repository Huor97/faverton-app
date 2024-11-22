<script setup lang="ts">
import { gsap } from 'gsap';

const componentRef = ref<HTMLElement | null>(null);
const iconRef = ref<HTMLElement | null>(null);
const titleRef = ref<HTMLElement | null>(null);
const paragraphRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (componentRef.value) {
    gsap.fromTo(
      componentRef.value,
      {
        autoAlpha: 0,
        y: 50,
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: componentRef.value,
          start: `top 80%`,
          once: true,
        },
      },
    );
  }
});

onMounted(() => {
  if (iconRef.value) {
    gsap.fromTo(
      iconRef.value,
      {
        autoAlpha: 0,
        x: -30,
      },
      {
        autoAlpha: 1,
        x: 0,
        duration: 1,
        scrollTrigger: {
          trigger: iconRef.value,
          start: `top 80%`,
          once: true,
        },
      },
    );
  }
});

onMounted(() => {
  if (titleRef.value) {
    gsap.fromTo(
      titleRef.value,
      {
        autoAlpha: 0,
        x: -50,
      },
      {
        autoAlpha: 1,
        x: 0,
        scrollTrigger: {
          trigger: titleRef.value,
          start: `top 80%`,
          once: true,
        },
      },
    );
  }
});

onMounted(() => {
  if (paragraphRef.value) {
    gsap.fromTo(
      paragraphRef.value,
      {
        autoAlpha: 0,
        x: -50,
      },
      {
        autoAlpha: 1,
        x: 0,
        scrollTrigger: {
          trigger: paragraphRef.value,
          start: `top 80%`,
          once: true,
        },
      },
    );
  }
});
</script>

<template>
  <div
    ref="componentRef"
    class="w-[240px]"
  >
    <div class="bg-[#0077b6] absolute border border-cyan-500 rounded-md shadow-lg w-[240px] h-auto">
      <div class="static h-auto width-full min-h-auto grid grid-cols-1 gap-4">
        <div class="w-[46px] h-[34px] relative left-[29px] mt-[30px] mb-[30px]">
          <div
            ref="iconRef"
            class="relative bottom-0 left-0 right-0 top-0"
          >
            <svg
              class="w-[46px] h-[34px]"
              preserveAspectRatio="xMidYMid meet"
              data-bbox="19.868 38.586 160.264 121.194"
              viewBox="19.868 38.586 160.264 121.194"
              height="200"
              width="200"
              xmlns="http://www.w3.org/2000/svg"
              data-type="color"
              role="presentation"
              aria-hidden="true"
              aria-label=""
            >
              <g>
                <path
                  d="M149.73 83.547c-2.538-25.284-24.211-44.961-49.73-44.961S52.808 58.263 50.269 83.547c-17.67 3.837-30.401 19.54-30.401 37.674 0 21.261 17.297 38.559 38.559 38.559h83.146c21.261 0 38.559-17.297 38.559-38.559 0-18.135-12.732-33.838-30.402-37.674zm-8.157 64.423H58.427a26.755 26.755 0 0 1-16.198-5.482l21.237-21.114 13.181 13.19 36.505-35.875 8.081 8.047 6.076-30.357-30.353 6.177 8.281 8.243-28.512 28.025-13.236-13.239-28.56 28.399a26.646 26.646 0 0 1-3.252-12.763c0-13.887 10.85-25.598 24.701-26.661l5.452-.419v-5.488l-.003-.16C61.868 67.486 78.992 50.395 100 50.395c21.047 0 38.171 17.078 38.172 38.069l-.004 5.677 5.453.419c13.851 1.063 24.701 12.774 24.701 26.661 0 14.749-11.999 26.749-26.749 26.749z"
                  fill="#FD6262"
                  data-color="1"
                />
              </g>
            </svg>
          </div>
        </div>
        <div class="w-[190px] h-auto relative left-[28px]">
          <h3
            ref="titleRef"
            class="text-lg"
          >
            <span class="leading-normal">
              Modernisation du Cloud Analytics
            </span>
          </h3>
        </div>
        <div class="w-[183px] h-auto relative left-[28px] text-sm mb-3 text-slate-700">
          <p ref="paragraphRef">
            Paragraphe. Cliquez ici pour le modifier. Utilisez-le pour vous présenter à vos visiteurs.
          </p>
        </div>
        <div class="w-[183px] h-5 relative left-[28px]">
          <div class="bg-[#00b4d8] rounded-[7px] shadow-lg h-[6px] min-h-[2px]" />
        </div>
      </div>
    </div>
  </div>
</template>
