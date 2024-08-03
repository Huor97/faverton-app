<script setup lang="ts">
import { onMounted } from "vue";
import gsap from "gsap";

onMounted(() => {
  gsap.set(".container-intro", { opacity: 0 }); // Cache initialement le contenu

  gsap.to(".container-intro", {
    opacity: 1,
    duration: 1, // Durée de l'animation en secondes
    delay: 1, // Délai avant le début de l'animation en secondes
    ease: "power2.out" // Type d'easing pour une animation fluide
  });
});

</script>

<template>
    <div class="container-intro">

        <h1 class="titre-page">Titre de la page "Intro projet"</h1>
        <p class="sous-titre">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto error reiciendis blanditiis vitae unde omnis quidem pariatur iste cupiditate enim reprehenderit explicabo vero, sit ipsam fugit excepturi laboriosam itaque? Facilis.</p>

    </div>
</template>

<style scoped>
.container-intro {
  position: relative;
  z-index: 100;
  color: aliceblue;
  left: 35vw;
  top: 5;
  width: 40%;
  height: 100vh;
}

.container-intro >h1,
.container-intro > p {
  position: relative;
  top: 20vh;
}

</style>