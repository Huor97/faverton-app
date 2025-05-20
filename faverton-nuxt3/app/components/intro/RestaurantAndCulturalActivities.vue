<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { gsap } from 'gsap';

const leftRef = ref<HTMLElement | null>(null);
const btn = ref<HTMLElement | null>(null);

// onMounted(() => {
//   if (leftRef.value) {
//     gsap.from(leftRef.value.children, {
//       opacity: 0,
//       y: 20,
//       stagger: 0.3,
//       scrollTrigger: {
//         trigger: leftRef.value,
//         start: `top 45%`,
//         end: `bottom 45%`,
//         scrub: true,
//         onLeave: () => {
//           if (leftRef.value) {
//             gsap.to(leftRef.value.children, { opacity: 0 });
//           }
//         },
//         // markers: true, // Utile pour le débogage, à retirer en production
//       },
//     });
//   }
// });

onMounted(() => {
  if (leftRef.value) {
    gsap.fromTo(
      leftRef.value,
      {
        autoAlpha: 0,
        x: -50,
      },
      {
        autoAlpha: 1,
        x: 0,
        scrollTrigger: {
          trigger: leftRef.value,
          start: `top 50%`,
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
          end: `bottom 45%`,
          toggleActions: `play reverse play reverse`,
        //   markers: true,
        },
      },
    );
  }
});

const goToWindTurbine = () => {
  navigateTo(`/introduction/wind-turbine`);
};
</script>

<template>
  <div class="relative flex flex-col justify-end text-white overflow-hidden">
    <div
      ref="leftRef"
      class="flex flex-col items-center backdrop-blur-sm"
    >
      <p class="md:w-2/4 p-5">
        <b class="md:text-[32px]">Restaurant and Cultural Activities.</b>
        <span class="text-slate-100 md:text-[32px]">
          Savourez des repas de la ferme à l’assiette, assistez à des cours de cuisine et participez à des festivals culturels célébrant la nature, la gastronomie et la communauté.
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
