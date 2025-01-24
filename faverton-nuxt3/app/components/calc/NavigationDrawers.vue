<script setup lang="ts">
import type { PVGISData } from "~/types/potential-solar";

const props = defineProps<{
  // TODO: ajouter le type correct
  solarPotential?: PVGISData
}>();

const rail = ref(true);
const drawer = ref(true);

// TODO: structure prop passer à composant FavertonDoughnut
// - passe just potential energie annuel pour mvp
const potentialSolarTotals = computed(() => {
  if (props.solarPotential === undefined) return;
  return props.solarPotential?.outputs;
});
</script>

<template>
  <VNavigationDrawer
    v-model="drawer"
    :width="600"
    location="right"
    :rail="rail"
    permanent
    @click="rail = false"
  >
    <template #append>
      <VBtn
        :icon="rail ? 'mdi-chevron-left' : 'mdi-chevron-right'"
        variant="text"
        @click.stop="rail = !rail"
      />
    </template>
    <v-divider />
    <VList
      v-if="!potentialSolarTotals"
      density="compact"
      nav
    >
      <VListItem prepend-icon="mdi-account">
        Il faut saisir une address dans le chemps de recherch :)
      </VListItem>
    </VList>

    <VList
      v-else
      density="compact"
      nav
    >
      <VListItem prepend-icon="mdi-account">
        <FavertonDoughnut :potential-solar-totals />
      </VListItem>
      <VListItem prepend-icon="mdi-account">
        Production d'énergie annuelle moyenne (E_y) : {{ potentialSolarTotals?.totals.fixed.E_y }} kWh/an
      </VListItem>
      <VListItem prepend-icon="mdi-account">
        Production d'énergie mensuelle moyenne (E_m) : {{ potentialSolarTotals?.totals.fixed.E_m }} kWh/mois1
      </VListItem>
      <VListItem prepend-icon="mdi-account">
        Production d'énergie journalière moyenne (E_d) : {{ potentialSolarTotals?.totals.fixed.E_d }} kWh/jour1
      </VListItem>
      <VListItem prepend-icon="mdi-account">
        Variation annuelle de la production (SD_y) : {{ potentialSolarTotals?.totals.fixed.SD_y }} kWh1
      </VListItem>
      <VListItem prepend-icon="mdi-account">
        Perte totale du système (l_total) : {{ potentialSolarTotals?.totals.fixed.l_total }}%
      </VListItem>

      <VListItem prepend-icon="mdi-account">
        <!-- TODO: si personne connecter : tout l'information qui est dans potentialSolarTotals va être enregistré dans bdd table favoris -->
        <!-- TODO: sinon redrige vers la page de connexion -->
        Ajouter au favorie votre recherche LINK :)
      </VListItem>
    </VList>
  </VNavigationDrawer>
</template>
