<script setup>
// ...existing 3D logic...
useHead({
  link: [
    {
      rel: `preconnect`,
      href: `https://fonts.googleapis.com`,
    },
    {
      rel: `preconnect`,
      href: `https://fonts.gstatic.com`,
      crossorigin: `anonymous`,
    },
    {
      rel: `stylesheet`,
      href: `https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=Concert+One&display=swap`,
    },
  ],
});
const router = useRouter();

const navigateToIntroduction = () => {
  router.push(`/introduction`);
};
</script>

<template>
  <div>
    <div class="absolute flex justify-center w-full">
      <h1 class="hero-title-stroke text-center text-[8vw] font-bold font-extrablack">
        Bienven<span class="relative z-10">u</span>e
        s<span class="relative z-10">u</span>r
        <span class="relative z-10">
          Faverton
        </span>
      </h1>
    </div>
    <div class="flex justify-center items-center w-full h-screen">
      <div class="z-10 flex flex-col items-start p-6 w-1/5">
        <p class="text-xl font-bold text-white text-balance text-shadow-lg/30">
          Votre partenaire en transition énergétique agricole
        </p>
        <div>
          <UButton
            class="mt-5 shadow-lg"
            size="xl"
            @click="navigateToIntroduction"
          >
            Découvrir nos services
          </UButton>
        </div>
      </div>
    </div>
    <WelcomeScreen />
  </div>
</template>

<style scoped>
h1 {
  font-family: "Concert One", sans-serif;
  font-weight: 700;
  font-style: normal;
}
</style>
