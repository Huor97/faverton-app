<script setup lang="ts">
import { onMounted } from "vue";
import gasp from "gsap";

onMounted(() => {
  gasp.set(`.container-intro`, { opacity: 0 }); // Cache initialement le contenu
  gasp.to(`.container-intro`, {
    opacity: 1,
    duration: 1, // Durée de l'animation en secondes
    delay: 0.5, // Délai avant le début de l'animation en secondes
    ease: `power2.out`, // Type d'easing pour une animation fluide
  });
});
</script>

<template>
  <div class="container-intro relative left-[35vw] top-[15vh] w-[40%] h-screen text-white">
    <div class="p-5 shadow-lg shadow-green-500/60 backdrop-blur-sm">
      <h1 class="relative text-center t-[20vh] text-[36px]">
        Titre "Intro projet"
      </h1>
      <p class="relative text-center mt-5 t-[20vh] text-current text-[18px]">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto error reiciendis blanditiis vitae unde omnis quidem
        pariatur iste cupiditate enim reprehenderit explicabo vero, sit ipsam fugit excepturi laboriosam itaque? Facilis.
      </p>
    </div>
  </div>
</template>
