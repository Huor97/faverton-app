<script setup lang="ts">
const rail = ref(true);
const drawer = ref(true);
</script>

<template>
  <VNavigationDrawer
    v-model="drawer"
    :width="700"
    location="right"
    :rail="!rail"
    temporary
  >
    <!-- <div
      v-if="status === 'pending'"
      class="flex items-center justify-center h-full "
    >
      <VProgressCircular
        color="amber"
        indeterminate
        :size="128"
      />
    </div> -->

    <!-- <template v-else>
      <VList
        v-if="!solarPotential"
        density="compact"
        nav
      >
        Il faut saisir une address dans le chemps de recherch et le surface :)
      </VList>

      <VList
        v-else
        density="compact"
        nav
      >
        <CalcSimulationYearlyAmount :amount-euros-per-year />
        <FavertonBtn
          button="ajouter dans history"
        />
      </VList>
    </template> -->
  </VNavigationDrawer>
</template>
