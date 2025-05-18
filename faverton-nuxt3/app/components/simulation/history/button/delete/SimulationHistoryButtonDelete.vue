<script setup lang="ts">
const props = defineProps<{
  simulationId?: string
}>();

const emit = defineEmits([`deleted`]);

const isLoading = ref(false);
const error = ref<unknown | null>(null);
async function deleteSimulation() {
  if (!props.simulationId) return;

  try {
    isLoading.value = true;

    await $fetch(`/api/simulation/history/${props.simulationId}`, {
      method: `DELETE`,
    });

    emit(`deleted`, props.simulationId);

    useToast?.().add({
      title: `Suppression réussie`,
      description: `La simulation a été supprimée de votre historique`,
      color: `green`,
      timeout: 3000,
    });
  }
  catch (e) {
    console.error(`Erreur lors de la suppression de la simulation:`, e);
    error.value = e;

    useToast?.().add({
      title: `Erreur`,
      description: `Impossible de supprimer la simulation`,
      color: `red`,
      timeout: 3000,
    });
  }
  finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <button
    class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    :disabled="isLoading || !simulationId"
    @click="deleteSimulation"
  >
    Supprimer de l'historique
  </button>
</template>
