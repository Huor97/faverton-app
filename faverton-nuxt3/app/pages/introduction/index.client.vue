<script setup lang="ts">
import logo from '~/assets/favertonLogo.png';

const chang = ref(false);
const isScrolled = ref(false);
const targetSection = ref<HTMLElement | null>(null);
const isSmallScreen = ref(false);

const mediaQuery = window.matchMedia(`(max-width: 639px)`);

const updateScreenSize = (e: MediaQueryListEvent): void => {
  isSmallScreen.value = e.matches;
};

onMounted(() => {
  isSmallScreen.value = mediaQuery.matches;
  mediaQuery.addEventListener(`change`, updateScreenSize);
});

function scrollToSection() {
  targetSection.value?.scrollIntoView({ behavior: `smooth` });
}

onMounted(() => {
  window.addEventListener(`scroll`, () => {
    isScrolled.value = window.scrollY > 50;
  });
});

onUnmounted(() => {
  mediaQuery.removeEventListener(`change`, updateScreenSize);
});
</script>

<template>
  <div>
    <div
      class="fixed z-index-[-1] m-0 p-0 bg-[url(~/assets/backgroundImage.jpg)] transition-all duration-500 ease-in-out bg-cover bg-center w-full h-screen "
      :class="{ 'filter brightness-[0.3]': chang }"
    />
    <div class="relative z-index-1">
      <ClientOnly>
        <template #default>
          <AppHeader v-if="!isSmallScreen" />
          <MobileMenu v-else />
        </template>
      </ClientOnly>
      <div class="flex justify-end w-full ">
        <div class="flex justify-center lg:w-[93.75%] xl:w-[95%]">
          <div class="text-white flex flex-col items-center gap-3 h-screen md:gap-3 w-[40%] sm:w-[47%] lg:w-[47%] xl:w-[55%]">
            <div class="mt-20 flex justify-center w-[35%] sm:mt-[5%] sm:w-[20%] lg:w-[20%] xl:w-[20%]">
              <FavertonLogo v-if="!isSmallScreen" />
              <img
                v-else
                :src="logo"
                alt="faverton"
              >
            </div>
            <div class="flex flex-col items-center gap-6 text-balance">
              <h1
                class="text-nowrap font-extrabold text-2xl sm:text-3xl lg:text-4xl xl:text-6xl 2xl:text-7xl"
              >
                GO GREEN & SAVE THE PLANET
              </h1>
              <p class="text-justify font-medium text-xl xl:text-2xl">
                Bienvenue dans le monde serein des maisons de ferme vertes, où durabilité et charme de la vie à la campagne se rencontrent. Une maison de ferme verte n'est pas simplement un logement ; c'est l'incarnation de la conscience écologique, d'une vie harmonieuse avec la nature et de l'engagement envers la préservation de l'environnement.
              </p>
            </div>
            <div class="mt-20 max-md:mt-4">
              <img
                src="~/assets/scroll-down.svg"
                alt="scroll"
                class="size-24 animate-bounce cursor-pointer md:size-36"
                @click="scrollToSection"
              >
            </div>
          </div>
        </div>
      </div>
      <div
        ref="targetSection"
        class="min-h-screen flex justify-end xl:max-w-[100%]"
      >
        <TargetFaverton @hover-change="(value: boolean) => chang = value" />
      </div>
    </div>
  </div>
</template>
