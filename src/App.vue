<script setup lang="ts">
import WelcomeFaverton from "./components/welcome-faverton.vue";
import BackgroundFirstPage from "./components/background-first-page.vue"
import Intro from "./components/intro.vue"
import WindTurbine from "./components/wind-turbine.vue"
import BioGasSolarPanel from "./components/bio-gas-solar-panel.vue"
import HydroElectric from "./components/hydro-electric.vue"

import { ref } from "vue";
const showSections = ref(false);



</script>

<template>
  <!-- <Nav /> -->

  <WelcomeFaverton v-if="showSections === false" @startClicked="showSections = true" />

  <template v-else>

    <BackgroundFirstPage />
    <Intro />
    <WindTurbine />
    <BioGasSolarPanel />
    <HydroElectric />
    <div></div>

  </template>

</template>

<style scoped>
div {
  height: 100vh;
}
</style>
