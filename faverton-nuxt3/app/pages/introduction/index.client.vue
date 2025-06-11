<script setup lang="ts">
import logo from '~/assets/favertonLogo.png';

const chang = ref(false);
const isScrolled = ref(false);
const targetSection = ref<HTMLElement | null>(null);

function scrollToSection() {
  targetSection.value?.scrollIntoView({ behavior: `smooth` });
}

onMounted(() => {
  window.addEventListener(`scroll`, () => {
    isScrolled.value = window.scrollY > 50;
  });
});

const { isMobile } = useDevice();
const isSmallScreen = computed(() => isMobile);
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
        <div
          class="z-index-[999] absolute top-4"
          :class="!isSmallScreen? 'left-32' : 'left-16'"
        >
          <UBreadcrumb
            :links="[{ label: 'Accueil' }]"
          >
            <template #default="{ link, isActive }">
              <UBadge
                :color="isActive ? 'primary' : 'gray'"
                class="rounded-full truncate"
              >
                {{ link.label }}
              </UBadge>
            </template>
          </UBreadcrumb>
        </div>
        <div class="flex justify-center lg:w-[93.75%] xl:w-[95%]">
          <div class="text-white flex flex-col items-center gap-3  h-screen">
            <div class="mt-20 flex justify-center w-[35%] sm:mt-[5%] sm:w-[20%] lg:w-[20%] xl:w-[20%]">
              <FavertonLogo v-if="!isSmallScreen" />
              <img
                v-else
                :src="logo"
                alt="faverton"
              >
            </div>
            <div class="text-center flex flex-col items-center gap-6 text-balance max-w-[83%]">
              <h1
                class="font-extrabold text-4xl xl:text-6xl 2xl:text-7xl"
              >
                Votre Transition Énergétique Commence Ici
              </h1>
              <p class="text-justify font-medium text-xl xl:text-2xl p-2">
                Bienvenue chez Faverton, votre partenaire pour évaluer le potentiel solaire de vos terres agricoles. Notre simulateur gratuit vous permet de visualiser en quelques clics les opportunités de production d'énergie renouvelable sur votre exploitation.
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
