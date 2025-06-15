<script setup lang="ts">
import { gsap } from 'gsap';
import type { NuxtError } from '#app';

const messageErreur = ref<HTMLElement | null>(null);
const imageAnime = ref<HTMLElement | null>(null);

const props = defineProps({
  error: Object as () => NuxtError,
});

onMounted(() => {
  if (messageErreur.value) {
    gsap.to(messageErreur.value, {
      rotation: 27,
      x: 100,
      duration: 1,
      delay: 2,
      yoyo: true,
      repeat: 1,
    });
  }
});

onMounted(() => {
  if (imageAnime.value) {
    gsap.to(imageAnime.value, {
      rotation: 360,
      x: 80,
      y: 450,
      duration: 5,
      delay: 2,
      ease: `elastic.out`,
    });
  }
});

const getErrorTitle = () => {
  switch (props.error?.statusCode) {
    case 404:
      return `Page introuvable`;
    case 500:
      return `Erreur du serveur`;
    case 403:
      return `Accès refusé`;
    default:
      return `Une erreur est survenue`;
  }
};

const getErrorMessage = () => {
  switch (props.error?.statusCode) {
    case 404:
      return `La page que vous recherchez semble avoir été déplacée ou n'existe plus.`;
    case 500:
      return `Nous rencontrons des difficultés techniques. Veuillez réessayer dans quelques instants.`;
    case 403:
      return `Vous n'avez pas les permissions nécessaires pour accéder à cette page.`;
    default:
      return `Une erreur inattendue s'est produite. Notre équipe a été notifiée.`;
  }
};

// SEO
useHead({
  title: `Erreur ${props.error?.statusCode || `404`} - Faverton`,
  meta: [
    {
      name: `description`,
      content: `Page d'erreur - Faverton, solutions durables pour un avenir vert`,
    },
  ],
});
</script>

<template>
  <div
    class="flex flex-col items-center justify-center h-screen gap-3"
  >
    <NuxtImg
      src="https://res.cloudinary.com/dizwmnpet/image/upload/e_background_removal/f_png/v1750009839/134291_aiyqvl.jpg"
      alt="Article image"
      class="fixed -top-5"
    />

    <img
      ref="imageAnime"
      src="~/assets/favertonLogo.png"
      alt="Faverton"
      class="w-24 h-24 mx-auto mb-4"
    >
    <h1
      ref="messageErreur"
      class="text-9xl font-bold text-shadow-xl mt-10"
    >
      {{ error?.statusCode || '404' }}
    </h1>

    <h2 class="z-10 text-2xl font-semibold text-gray-700 mb-3">
      {{ getErrorTitle() }}
    </h2>
    <p class="text-gray-600 text-lg px-5 md:px-0">
      {{ getErrorMessage() }}
    </p>

    <UButton
      size="xl"
      label="Retour à la page précédante"
      class="z-10"
      @click="$router.back()"
    />

    <div class="flex gap-5 p-5">
      <NuxtLink
        to="/simulator"
        class="z-10 text-blue-600 hover:text-blue-800 font-medium underline"
      >
        Simulateur solaire
      </NuxtLink>
      <NuxtLink
        to="/introduction"
        class="z-10 text-green-600 hover:text-green-800 font-medium underline"
      >
        Découvrir Faverton
      </NuxtLink>
    </div>

    <p class="text-sm text-gray-600">
      🌱 Explorez nos solutions durables pour un avenir plus vert
    </p>
  </div>
</template>
