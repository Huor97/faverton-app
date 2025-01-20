<script setup lang="ts">
const props = defineProps<{
  // TODO: ajouter le type correct
  solarPotential: Object
}>()
const rail = ref(true)
const drawer = ref(true)

// TODO: structure prop passer à composant FavertonDoughnut
// - passe just tot energie annuel pour mvp
</script>
<template>
    <VNavigationDrawer 
        :width="400" 
        location="right"
        v-model="drawer"
        :rail="rail"
        permanent
        @click="rail = false"

    >
      <v-divider></v-divider>
      <template v-slot:append>
            <v-btn
               :icon="rail ? 'mdi-chevron-left' : 'mdi-chevron-right'"
              variant="text"
              @click.stop="rail = !rail"
            >
          </v-btn>
      </template>
      <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-account" value="account">
              <FavertonDoughnut />
          </v-list-item>
          <v-list-item prepend-icon="mdi-account" value="account">
            <pre>{{ solarPotential }}</pre>
          </v-list-item>
      </v-list>
    </VNavigationDrawer>
</template>