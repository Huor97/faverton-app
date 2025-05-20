<script setup lang="ts">
import { onMounted, ref } from "vue";
import { gsap } from 'gsap';

const bioGazRef = ref<HTMLElement | null>(null);
const btn = ref<HTMLElement | null>(null);

onMounted(() => {
  if (bioGazRef.value) {
    gsap.fromTo(
      bioGazRef.value,
      {
        autoAlpha: 0,
        x: -50,
      },
      {
        autoAlpha: 1,
        x: 0,
        scrollTrigger: {
          trigger: bioGazRef.value,
          start: `top 45%`,
          end: `bottom 60%`,
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
          start: `top 80%`,
          end: `bottom 45%`,
          toggleActions: `play reverse play reverse`,
          // markers: true,
        },
      },
    );
  }
});

const goToWindTurbine = () => {
  navigateTo(`/introduction/bio-gaz`);
};
</script>

<template>
  <div class="relative flex flex-col justify-end text-white overflow-hidden">
    <div
      ref="bioGazRef"
      class="flex flex-col items-center backdrop-blur-sm"
    >
      <p class="md:w-2/4 p-5">
        <b class="md:text-[32px]">Pratiques de Conservation de l'Eau.</b>
        <span class="text-slate-100 md:text-[32px]">
          La gestion de l'eau est un aspect crucial des maisons de ferme vertes. Des systèmes de collecte des eaux pluviales et de recyclage des eaux grises sont mis en place pour réduire la consommation d'eau potable. De plus, des aménagements paysagers intelligents et des méthodes d'irrigation économes en eau sont utilisés pour préserver les ressources hydriques et favoriser la croissance de plantes adaptées à l'environnement local.
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
