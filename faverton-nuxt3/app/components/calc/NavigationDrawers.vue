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
    permanent
    location="right"
    :width="50"
  >
    <template #append>
      <VBtn
        :icon="drawer ? 'mdi-chevron-right' : 'mdi-chevron-left'"
        variant="text"
        @click.stop="drawer = !drawer"
      />
    </template>
  </VNavigationDrawer>
  <VNavigationDrawer
    v-model="drawer"
    :width="700"
    location="right"
    :rail="!rail"
    temporary
  >
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
      <VListItem>
        <FavertonDoughnut :potential-solar-totals />
      </VListItem>
      <VListItem>
        Production d'énergie annuelle moyenne (E_y) : {{ potentialSolarTotals?.totals.fixed.E_y }} kWh/an
      </VListItem>
      <VListItem>
        Production d'énergie mensuelle moyenne (E_m) : {{ potentialSolarTotals?.totals.fixed.E_m }} kWh/mois1
      </VListItem>
      <VListItem>
        Production d'énergie journalière moyenne (E_d) : {{ potentialSolarTotals?.totals.fixed.E_d }} kWh/jour1
      </VListItem>
      <VListItem>
        Variation annuelle de la production (SD_y) : {{ potentialSolarTotals?.totals.fixed.SD_y }} kWh1
      </VListItem>
      <VListItem>
        Perte totale du système (l_total) : {{ potentialSolarTotals?.totals.fixed.l_total }}%
      </VListItem>

      <VListItem>
        <!-- TODO: si personne connecter : tout l'information qui est dans potentialSolarTotals va être enregistré dans bdd table favoris -->
        <!-- TODO: sinon redrige vers la page de connexion -->
        Ajouter au favorie votre recherche LINK :)
      </VListItem>
    </VList>
  </VNavigationDrawer>
</template>
