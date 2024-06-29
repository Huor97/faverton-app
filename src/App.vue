<script setup lang="ts">
import WelcomeFaverton from "./components/welcome-faverton.vue";
import BackgroundFirstPage from "./components/background-first-page.vue"
import Intro from "./components/intro.vue"
import WindTurbine from "./components/wind-turbine.vue"
import BioGasSolarPanel from "./components/bio-gas-solar-panel.vue"
import HydroElectric from "./components/hydro-electric.vue"
import Header from "./components/header.vue"
import { ref } from "vue";
const showSections = ref(false);



</script>

<template>
  <!-- <Nav /> -->

  <WelcomeFaverton v-if="showSections === false" @startClicked="showSections = true" />

  <template v-else>

    <BackgroundFirstPage />
    <Header />
    <Intro />
    <WindTurbine />
    <BioGasSolarPanel />
    <HydroElectric />
    <div class="fist-page-header"></div>

  </template>



</template>

<style scoped>
.fist-page-header {
  height: 100vh;
}
</style>
