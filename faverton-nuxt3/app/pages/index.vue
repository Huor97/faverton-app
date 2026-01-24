<script setup lang="ts">
const router = useRouter();

const navigateToIntroduction = () => {
  router.push(`/introduction`);
};
</script>

<template>
  <div class="h-screen w-full relative overflow-hidden bg-black font-sans">
    <!-- Background (Image + Clouds) -->
    <TheBackground />

    <!-- 3D Scene Layer -->
    <div class="absolute inset-0 z-0">
      <ClientOnly>
        <WelcomeScreen />
      </ClientOnly>
    </div>

    <!-- Main Content Layer -->
    <div class="relative z-20 flex flex-col items-center justify-center h-full text-center px-4 pointer-events-none">
      <h1 class="text-4xl md:text-[5vw] font-thin text-white tracking-wide leading-tight drop-shadow-lg mb-4 md:mb-8">
        Cultivez l'Énergie de Demain
      </h1>
      
      <p class="text-sm md:text-xl text-white/90 max-w-2xl mb-6 md:mb-10 leading-relaxed font-light drop-shadow-md bg-black/20 p-3 md:p-4 rounded-xl backdrop-blur-sm border border-white/5">
        Faverton, votre partenaire pour évaluer le potentiel solaire de vos terres agricoles. Notre simulateur gratuit vous permet de visualiser en quelques clics les opportunités de production d'énergie renouvelable sur votre exploitation.
      </p>
      
      <button 
        @click="navigateToIntroduction"
        class="pointer-events-auto px-6 py-2 md:px-8 md:py-3 rounded-full border border-white/20 bg-black/30 backdrop-blur-md text-white/90 text-sm md:text-base uppercase tracking-widest hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
      >
        Découvrir nos services
      </button>
    </div>

    <!-- Floating Stats Cards -->
    <StatsCard 
      title="Estimation Production" 
      value="8,450" 
      unit="kwh" 
      type="production" 
      simulation
      positionClass="top-24 right-4 md:top-32 md:right-[20%] origin-top-right"
    />

    <StatsCard 
      title="Revenu Potentiel" 
      value="€12,450" 
      trend="+12% vs last month"
      type="revenue" 
      simulation
      positionClass="bottom-24 left-4 md:bottom-32 md:left-[20%] origin-bottom-left"
    />

    <StatsCard 
      title="Performance Estimée" 
      type="performance" 
      simulation
      positionClass="bottom-8 right-4 md:bottom-20 md:right-[25%] origin-bottom-right"
    />
  </div>
</template>
