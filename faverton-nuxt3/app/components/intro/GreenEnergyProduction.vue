<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { gsap } from 'gsap';

const section1 = ref<HTMLElement | null>(null);
const btn = ref<HTMLElement | null>(null);

// onMounted(() => {
//   if (section1.value) {
//     gsap.from(section1.value.children, {
//       opacity: 0,
//       y: 20,
//       stagger: 0.3,
//       scrollTrigger: {
//         trigger: section1.value,
//         start: `top 90%`,
//         end: `bottom 75%`,
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
  if (section1.value) {
    gsap.fromTo(
      section1.value,

      {
        autoAlpha: 0,
        x: 100,
      },
      {
        autoAlpha: 1,
        x: 0,
        scrollTrigger: {
          trigger: section1.value,
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
        x: 300,
      },
      {
        autoAlpha: 1,
        x: 0,
        scrollTrigger: {
          trigger: btn.value,
          start: `top 80%`,
          end: `bottom 60%`,
          toggleActions: `play reverse play reverse`,
          // markers: true,
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
      ref="section1"
      class="flex flex-col items-center backdrop-blur-sm"
    >
      <p class="md:w-2/4 p-5">
        <b class="md:text-[32px]">Solutions d'Énergie Durable.</b>
        <span class="text-slate-100 md:text-[32px]">
          Les maisons de ferme vertes sont équipées de solutions énergétiques durables pour réduire leur empreinte carbone. Cela peut inclure l'utilisation de panneaux solaires pour la production d'électricité, de systèmes de chauffage géothermiques pour le chauffage et la climatisation, ainsi que la mise en place de systèmes de gestion de l'énergie pour optimiser la consommation. L'objectif est de minimiser la dépendance aux combustibles fossiles et de promouvoir l'utilisation d'énergies renouvelables.
        </span>
        <!-- NOTE: dont work animation left to right -->
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
