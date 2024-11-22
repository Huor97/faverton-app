<script setup lang="ts">
import { onMounted } from "vue";
import gasp from "gsap";

onMounted(() => {
  gasp.set(`.container-intro`, { opacity: 0 }); // Cache initialement le contenu
  gasp.to(`.container-intro`, {
    opacity: 1,
    duration: 0.7, // Durée de l'animation en secondes
    delay: 0.5, // Délai avant le début de l'animation en secondes
    ease: `power2.out`, // Type d'easing pour une animation fluide
  });
});
</script>

<template>
  <div class="container-intro flex justify-center items-center h-screen relative text-white">
    <div class="p-l w-[60%] backdrop-blur-sm">
      <h1 class="relative text-center t-[20vh] md:text-[42px]">
        GO GREEN & SAVE THE PLANET
      </h1>
      <p class="relative text-center mt-5 t-[20vh] text-current md:text-[28px]">
        Bienvenue dans le monde serein des maisons de ferme vertes, où durabilité et charme de la vie à la campagne se rencontrent. Une maison de ferme verte n'est pas simplement un logement ; c'est l'incarnation de la conscience écologique, d'une vie harmonieuse avec la nature et de l'engagement envers la préservation de l'environnement.
      </p>
    </div>
  </div>
</template>
