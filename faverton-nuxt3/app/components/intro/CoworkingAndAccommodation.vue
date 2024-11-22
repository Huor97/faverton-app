<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { gsap } from 'gsap';

const rigthRef = ref<HTMLElement | null>(null);
const btn = ref<HTMLElement | null>(null);

// onMounted(() => {
//   if (section1.value) {
//     gsap.from(section1.value.children, {
//       opacity: 0,
//       y: 20,
//       stagger: 0.3,
//       scrollTrigger: {
//         trigger: section1.value,
//         start: `top 100%`,
//         end: `bottom 45%`,
//         scrub: true,
//         onLeave: () => {
//           if (section1.value) {
//             gsap.to(section1.value.children, { opacity: 0 });
//           }
//         },
//         // markers: true, // Utile pour le débogage, à retirer en production
//       },
//     });
//   }
// });

onMounted(() => {
  if (rigthRef.value) {
    gsap.fromTo(
      rigthRef.value,
      {
        autoAlpha: 0,
        x: 50,
      },
      {
        autoAlpha: 1,
        x: 0,
        scrollTrigger: {
          trigger: rigthRef.value,
          start: `top 40%`,
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
  <div class="relative flex flex-col justify-start h-screen text-white overflow-hidden">
    <div
      ref="rigthRef"
      class="flex flex-col items-center backdrop-blur-sm"
    >
      <p class="md:w-2/4 p-5">
        <b class="md:text-[32px]">Travailler, Séjourner, Se Connecter.</b>
        <span class="text-slate-100 md:text-[32px]">
          Profitez d’espaces de coworking modernes et d’hébergements éco-responsables, alliant productivité et sérénité au cœur de la nature.
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
