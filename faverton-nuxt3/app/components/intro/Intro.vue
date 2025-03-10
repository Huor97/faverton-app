<script setup lang="ts">
import logo from '~/assets/favertonLogo.png';

const targetSection = ref<HTMLElement | null>(null);

function scrollToSection() {
  targetSection.value?.scrollIntoView({ behavior: `smooth` });
}

const isScrolled = ref(false);

onMounted(() => {
  window.addEventListener(`scroll`, () => {
    isScrolled.value = window.scrollY > 50;
  });
});
</script>

<template>
  <div>
    <div class="fixed z-index-[-1] m-0 p-0 bg-[url(~/assets/backgroundImage.jpg)] bg-cover bg-center w-full h-screen" />
    <div class="relative z-index-1">
      <ClientOnly>
        <AppHeader />
      </ClientOnly>
      <UContainer class="flex text-white justify-center h-screen">
        <div class="mt-20 flex flex-col items-center gap-14">
          <div class="flex justify-center">
            <img
              class="w-25"
              :src="logo"
              alt="faverton"
            >
          </div>
          <div class="flex flex-col items-center w-[58%] gap-10 text-justify">
            <h1
              class="text-5xl font-extrabold"
            >
              GO GREEN & SAVE THE PLANET
            </h1>

            <p class="font-bold">
              Bienvenue dans le monde serein des maisons de ferme vertes, où durabilité et charme de la vie à la campagne se rencontrent. Une maison de ferme verte n'est pas simplement un logement ; c'est l'incarnation de la conscience écologique, d'une vie harmonieuse avec la nature et de l'engagement envers la préservation de l'environnement.
            </p>
          </div>
          <div class="mt-15">
            <img
              src="~/assets/scroll-down.svg"
              alt="scroll"
              class="size-32 animate-bounce cursor-pointer"
              @click="scrollToSection"
            >
          </div>
        </div>
      </UContainer>
      <div
        ref="targetSection"
        class="min-h-screen"
      >
        <UContainer
          ref="targetSection"
          class="h-screen"
        >
          <div class="text-white">
            <IntroProjectPresentation />
          </div>
        </UContainer>
      </div>
    </div>
  </div>
</template>
